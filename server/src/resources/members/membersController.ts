import {
  Body,
  Controller,
  Delete,
  Get,
  Middlewares,
  Patch,
  Path,
  Post,
  Put,
  Query,
  Request,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from "@tsoa/runtime";
import { Permission } from "../../entities/Permission";
import { checkDepartmentAccess } from "../../middleware/authorization";
import { UnauthorizedError } from "../../types/Errors";
import { JWTPayload, PermissionAssignmentDto } from "../../types/authTypes";
import {
  AssignPermissionToMemberRequestDto,
  CreateMemberRequestDto,
  CreateMemberResponseDto,
  DepartmentDetailsDto,
  DepartmentMemberDto,
  DirectorDto,
  ItSkillsValue,
  LanguageValue,
  MemberDetailsDto,
  MemberImage,
  MemberPartialDto,
  StatusOverview,
  UpdateDepartmentDto,
} from "../../types/memberTypes";
import { canPermissionBeDelegated, doesPermissionsInclude } from "../../utils/authUtils";
import MembersService from "./MembersService";

/**
 * Controller for the members module
 * Provides routes for retrieving, creating and updating members, departments and permissions
 */
@Tags("Members")
@Route("members")
export class MembersController extends Controller {
  private membersService: MembersService = new MembersService();
  private assetsPath = process.env.ASSETS_PATH || (process.env.NODE_ENV === "test" ? "./test/assets" : "./assets");

  /**
   * Retrieves a list of all members
   * @summary Get all members
   */
  @Get("")
  @Security("jwt")
  public async getMembers(): Promise<MemberPartialDto[]> {
    const members = await this.membersService.getMemberList();
    return members;
  }

  /**
   * Retrieves the image of a member with the given `id`.
   * Returns null with status code 204 if no image was found.
   * @summary Get image of member
   * @param id The id of the member to retrieve the image from
   */
  @Get("{id}/image")
  @Security("jwt")
  public async getMemberImage(@Path() id: number) {
    const imageFolderPath = `${this.assetsPath}/images`;
    return await this.membersService.getMemberImage(imageFolderPath, id);
  }

  /**
   * Saves the image of a member with the given `id`
   * @param id The id of the member to save the image to
   * @param requestBody The image to save
   * @example requestBody {
   * "base64": "test",
   * "mimeType": "jpg"
   * }
   */
  @Post("{id}/image")
  @Security("jwt")
  public async saveImage(@Path() id: number, @Body() requestBody: MemberImage, @Request() request: any) {
    const user = request.user as JWTPayload;
    // The user can only save the image if he is the member himself
    if (id !== user.memberId) {
      throw new UnauthorizedError("Authorization failed: You are not permitted to do this");
    }

    const { base64, mimeType } = requestBody;
    const imageFolderPath = `${this.assetsPath}/images`;
    const imageName = `${id}.${mimeType}`;

    await this.membersService.saveMemberImage(imageFolderPath, imageName, base64);
  }

  /**
   * Retrieves all members of the departments (this does not include the director of a department)
   * @summary Get all members of departments
   */
  // TODO: Change route name
  @Get("department-members")
  @Security("jwt")
  public async getMembersOfDepartments(): Promise<DepartmentMemberDto[]> {
    const membersOfDepartments = await this.membersService.getMembersOfDepartments();
    return membersOfDepartments;
  }

  /**
   * Retrieves all current directors (if query parameter `current` is true) or all directors
   * @summary Get directors
   * @param current Query parameter to specify if only the current directors should be retrieved
   */
  @Get("directors")
  @Security("jwt")
  public async getDirectors(@Query("current") current: boolean): Promise<DirectorDto[]> {
    // Query parameter to specify if only the current directors should be retrieved
    const directors = await this.membersService.getDirectors(current);

    return directors;
  }

  /**
   * Creates a new member in the database and creates accounts
   * for the different systems (exchange, mediawiki)
   * @summary Create a new member
   *
   * @param requestBody The member to create
   *
   * @example requestBody {
   *   "vorname": "Max",
   *   "nachname": "Mustermann",
   *   "name": "m.mustermann",
   *   "geburtsdatum": "1990-01-01",
   *   "password": "s3cre7-123",
   *   "handy": "0123456789",
   *   "geschlecht": 1,
   *   "generation": 3,
   *   "traineeSeit": "2020-01-01",
   *   "email": "m.mustermann@email.de"
   * }
   */
  @Post("")
  @Security("jwt", ["1"])
  public async createMember(@Body() requestBody: CreateMemberRequestDto): Promise<CreateMemberResponseDto> {
    /**
     * Overview of the status of the different account creation operations
     */
    const statusOverview: StatusOverview = {
      // Status of the query to create a member in the database
      querySuccesful: false,

      // Error message if query failed
      queryErrorMsg: "",

      // Status of the mail api-call to create a mail account
      mailSuccesful: false,

      // Error message if mail account creation failed
      mailErrorMsg: "",

      // Status of the mail api-call to add the mail account to a mailing list
      mailListSuccesful: false,

      // Error message if mail account couldn't be added to the mailing list
      mailListErrorMsg: "",

      // Status of the nextcloud api-call to create a nextcloud account
      nextcloudSuccesful: false,

      // Error message if nextcloud account creation failed
      nextcloudErrorMsg: "",

      // Status of the mediawiki api-call to create a mediawiki account
      wikiSuccesful: false,

      // Error message if wiki account creation failed
      wikiErrorMsg: "",
    };

    const newMember = requestBody;
    const createMemberResponse: CreateMemberResponseDto = await this.membersService.createAccountsOfMember(
      newMember,
      statusOverview
    );
    this.setStatus(createMemberResponse.statusOverview.querySuccesful ? 201 : 500);
    return createMemberResponse;
  }

  /**
   * Updates the status of an existing member
   * Update can be done by members with certain permission
   * Update can be done by member himself with an additional permission
   * @summary Update the status of a member
   *
   * @param id The id of the member to update
   * @param requestBody The new status of the member
   *
   * @example requestBody {
   *  "memberStatus": "aktives Mitglied"
   * }
   */
  // TODO: Change route name
  @Patch("{id}/status")
  @Security("jwt", ["1"])
  public async updateMemberStatus(@Path() id: number, @Body() requestBody: { memberStatus: string }): Promise<void> {
    const status = requestBody.memberStatus;
    await this.membersService.updateMemberStatus(id, status);
  }

  /**
   * Retrieves all departments
   * @summary Get departments
   */
  @Get("departments")
  @Security("jwt")
  public async getDepartments(): Promise<DepartmentDetailsDto[]> {
    const departments = await this.membersService.getDepartments();

    return departments;
  }

  /**
   * Updates the information of an existing department
   * @summary Update a department
   * @param id The id of the department to update
   * @example requestBody {
   * "linkObjectivePresentation": "https://example.com",
   * "linkOrganigram": "https://example.com"
   * }
   */
  @Put("departments/{id}")
  @Security("jwt")
  @Middlewares(checkDepartmentAccess)
  public async updateDepartment(@Path() id: number, @Body() requestBody: UpdateDepartmentDto): Promise<void> {
    await this.membersService.updateDepartment(id, requestBody);
  }

  /**
   * Retrieves the language values
   * @summary Get languages
   */
  @Get("languages")
  @Security("jwt")
  public async getLanguages(): Promise<LanguageValue[]> {
    const languages = await this.membersService.getLanguageValues();

    return languages;
  }

  /**
   * Retrieves the edv skills
   * @summary Get edv skills
   */
  @Get("edv-skills")
  @Security("jwt")
  public async getEDVSkills(): Promise<ItSkillsValue[]> {
    const edvSkills = await this.membersService.getEdvSkillValues();

    return edvSkills;
  }

  /**
   * Retrieves all directors and members permission assignments
   * @summary Get permission assignments
   */
  @Get("permission-assignments")
  @Security("jwt")
  public async getPermissionAssignments(@Request() request: any): Promise<PermissionAssignmentDto[]> {
    const user = request.user as JWTPayload;
    const userHasAnyPermission = user.permissions.length > 0;
    if (!userHasAnyPermission) {
      throw new UnauthorizedError("Authorization failed: You are not permitted to do this");
    }
    const permissionAssignments = await this.membersService.getPermissionAssignments();

    return permissionAssignments;
  }

  /**
   * Retrieves name, description and ID of all permissions
   * @summary Get permissions
   */
  @Get("permissions")
  @Security("jwt")
  public async getPermissions(@Request() request: any): Promise<Permission[]> {
    const user = request.user as JWTPayload;
    const userHasAnyPermission = user.permissions.length > 0;
    if (!userHasAnyPermission) {
      throw new UnauthorizedError("Authorization failed: You are not permitted to do this");
    }

    const permissions = await this.membersService.getPermissions();

    return permissions;
  }

  /**
   * Create new permission for member
   * @summary Create permission
   * @param requestBody The permission to create
   * @param request The request which caused the error
   *
   * @example requestBody {
   *  "memberID": 8167,
   *  "permissionID": 8
   * }
   */
  @Post("permissions")
  @Security("jwt")
  @SuccessResponse("201")
  public async assignPermissionToMember(
    @Body() requestBody: AssignPermissionToMemberRequestDto,
    @Request() request: any
  ): Promise<void> {
    const user = request.user as JWTPayload;
    const { memberID, permissionID } = requestBody;
    const isUserAdmin = doesPermissionsInclude(user.permissions, [100]);

    // Checks if the member is allowed to delegate the permission (if they are not an admin)
    if (
      !isUserAdmin &&
      (!doesPermissionsInclude(user.permissions, [permissionID]) ||
        !canPermissionBeDelegated(user.permissions, permissionID))
    ) {
      throw new UnauthorizedError("Permission cannot be delegated!");
    }

    await this.membersService.addPermissionToMember(memberID, permissionID);
  }

  /**
   * Delete issued permission from member
   * @summary Delete permission
   * @param requestBody The permission to delete
   * @param request The request which caused the error
   *
   * @example requestBody {
   *  "memberID": 8167,
   *  "permissionID": 8
   * }
   */
  @Delete("permissions")
  @Security("jwt")
  public async unassignPermissionFromMember(
    @Body() requestBody: AssignPermissionToMemberRequestDto,
    @Request() request: any
  ): Promise<void> {
    const user = request.user as JWTPayload;
    const { memberID, permissionID } = requestBody;
    const isUserAdmin = doesPermissionsInclude(user.permissions, [100]);

    // Checks if the member is allowed to delete the permission (if they are not an admin)
    if (
      !isUserAdmin &&
      (!doesPermissionsInclude(user.permissions, [permissionID]) ||
        !canPermissionBeDelegated(user.permissions, permissionID))
    ) {
      throw new UnauthorizedError("Permission cannot be deleted!");
    }

    await this.membersService.deletePermissionFromMember(memberID, permissionID);
  }

  /**
   * Retrieves a member specified by id
   * Returns financial data iff member has permission or is himself
   * @summary Get single member by id
   *
   * @param id The id of the member to retrieve
   */
  @Get("{id}")
  @Security("jwt")
  public async getMember(@Path() id: number, @Request() request: any): Promise<MemberDetailsDto> {
    const user = request.user;
    let userCanViewFinancialData = false;

    // Only if the user is the member to retrieve or they have the correct permissions
    // the financial data is retrieved as well
    if (id === user.mitgliedID || doesPermissionsInclude(user.permissions, [6])) {
      userCanViewFinancialData = true;
    }
    const member = await this.membersService.getMemberDetails(id, userCanViewFinancialData);
    return member;
  }

  /**
   * Updates the information of an existing member. Update of critical fields can be done by member with certain permission.
   * Update of critical and non critical fields can be done by member himself with additional permission
   * @summary Update a member
   * @param id The id of the member to update
   * @param requestBody The new information of the member
   *
   * @example requestBody {
   *   "memberId": 8111,
   *   "lastname": "Frye",
   *   "firstname": "Brandon-Lee",
   *   "gender": true,
   *   "birthday": "1990-06-06",
   *   "mobile": "0162/9846320",
   *   "jbtEmail": "b.frye@studentische-beratung.de",
   *   "memberStatus": {
   *     "memberStatusId": 1,
   *     "name": "Trainee"
   *   },
   *   "generation": 3,
   *   "internalProject": null,
   *   "traineeSince": "2011-05-01",
   *   "memberSince": "2012-12-01",
   *   "alumnusSince": null,
   *   "seniorSince": null,
   *   "activeSince": "2012-12-01",
   *   "passiveSince": null,
   *   "exitedSince": null,
   *   "department": {
   *     "departmentId": 5,
   *     "name": "Mitglieder",
   *     "shortName": "MIT"
   *   },
   *   "employer": "Versicherung International",
   *   "street1": "Woodsman Ave 61",
   *   "postalCode1": "70364",
   *   "city1": "Stuttgart",
   *   "phone1": null,
   *   "email1": "brandon-lee@gmx.de",
   *   "street2": "Budapester Straße 96",
   *   "postalCode2": "987654",
   *   "city2": "Reinesland Deutschland",
   *   "phone2": "07042/984365",
   *   "email2": "brandon-lee@gmx.de",
   *   "university": "Universität Hohenheim",
   *   "courseOfStudy": "Master of Financial Management",
   *   "studyStart": "2014-10-01",
   *   "studyEnd": null,
   *   "specializations": "Controlling und Unternehmensrechnung",
   *   "apprenticeship": null,
   *   "commitment": null,
   *   "canPL": "2013-12-23",
   *   "canQM": "2013-12-23",
   *   "lastChange": null,
   *   "drivingLicense": 0,
   *   "firstAidTraining": false,
   *   "accountHolder": "8912203a67b608ee8b1dc826b18df9ab1fa18cc28199268a80279cc543d838b280756f78ae495347663fad487573ab72d763e0b553931d883f4dd70acb45eb4a",
   *   "iban": "730984d2477de277a9d8c15860b9b703320d0195d898e0c64bf48856f425cb6cdf21240ed6d6c20b42d033bf8b623c4ec3dd9add15f9fbef743d1861e25cf703",
   *   "bic": "0ba933576f9624335f5b6773310f7429345a051310d9179c132c33c9e4b14c78822d5134d3ffa7b345f13f9b6906215f61aa605b0ea823844ccc47e7684d8a35",
   *   "languages": [
   *     {
   *       "memberId": 8111,
   *       "value": "Deutsch",
   *       "level": 5
   *     },
   *     {
   *       "memberId": 8111,
   *       "value": "English",
   *       "level": 3
   *     },
   *     {
   *       "memberId": 8111,
   *       "value": "Französisch",
   *       "level": 1
   *     }
   *   ],
   *   "itSkills": [
   *     {
   *       "memberId": 8111,
   *       "value": "MS-Office",
   *       "level": 3
   *     },
   *     {
   *       "memberId": 8111,
   *       "value": "PHP",
   *       "level": 1
   *     }
   *   ],
   *   "mentees": [],
   *   "mentor": null
   * }
   */
  @Patch("{id}")
  @Security("jwt")
  public async updateMember(
    @Path() id: number,
    @Body() requestBody: MemberDetailsDto,
    @Request() request: any
  ): Promise<void> {
    const user = request.user as JWTPayload;

    if (id === user.memberId && doesPermissionsInclude(user.permissions, [1])) {
      // Grants access to all fields if member is himself and has additional permission
      await this.membersService.updateMemberDetails(id, requestBody, true, true);
    } else if (id === user.memberId) {
      // Grants access to non critical fields to the member himself
      await this.membersService.updateMemberDetails(id, requestBody, false, true);
    } else if (doesPermissionsInclude(user.permissions, [1])) {
      // Grants access to critical fields for members with permission
      await this.membersService.updateMemberDetails(id, requestBody, true, false);
    } else {
      throw new UnauthorizedError("Authorization failed: You are not permitted to do this");
    }
  }
}
