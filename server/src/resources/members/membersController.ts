import MembersService from "./MembersService";
import {
  AssignPermissionToMemberRequest,
  CreateMemberRequest,
  CreateMemberResponse,
  Department,
  DepartmentMember,
  Director,
  MemberDetails,
  MemberImage,
  MemberPartial,
  MemberStatus,
  StatusOverview,
  UpdateDepartmentRequest,
  Value,
} from "../../types/membersTypes";
import {
  Body,
  Delete,
  Middlewares,
  Patch,
  Post,
  Put,
  Get,
  Route,
  Controller,
  Security,
  Tags,
  Request,
  Path,
  Query,
  SuccessResponse,
} from "@tsoa/runtime";
import { JWTPayload, Permission, PermissionAssignment } from "../../types/authTypes";
import { canPermissionBeDelegated, doesPermissionsInclude } from "../../utils/authUtils";
import { checkDepartmentAccess } from "../../middleware/authorization";
import { UnauthorizedError } from "../../types/Errors";

/**
 * Controller for the members module
 * Provides routes for retrieving, creating and updating members, departments and permissions
 */
@Tags("Members")
@Route("members")
export class MembersController extends Controller {
  private membersService: MembersService = new MembersService();
  private assetsPath = process.env.ASSETS_PATH || process.env.NODE_ENV === "test" ? "./test/assets" : "./assets";

  /**
   * Retrieves a list of all members
   * @summary Get all members
   */
  @Get("")
  @Security("jwt")
  public async getMembers(): Promise<MemberPartial[]> {
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
    if (id !== user.mitgliedID) {
      throw new UnauthorizedError("Authorization failed: You are not permitted to do this");
    }

    const { base64, mimeType } = requestBody;
    const imageFolderPath = `${this.assetsPath}/images`;
    const imageName = `${id}.${mimeType}`;

    await this.membersService.saveMemberImage(imageFolderPath, imageName, base64);
  }

  /**
   * Retrieves all members of the departments (this does not invclude the director of a department)
   * @summary Get all members of departments
   */
  // TODO: Change route name
  @Get("department-members")
  @Security("jwt")
  public async getMembersOfDepartments(): Promise<DepartmentMember[]> {
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
  public async getDirectors(@Query("current") current: boolean): Promise<Director[]> {
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
  public async createMember(@Body() requestBody: CreateMemberRequest): Promise<CreateMemberResponse> {
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
    const createMemberResponse: CreateMemberResponse = await this.membersService.createAccountsOfMember(
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
   *  "mitgliedstatus": "aktives Mitglied"
   * }
   */
  // TODO: Change route name
  @Patch("{id}/status")
  @Security("jwt", ["1"])
  public async updateMemberStatus(
    @Path() id: number,
    @Body() requestBody: { mitgliedstatus: MemberStatus }
  ): Promise<void> {
    const status = requestBody.mitgliedstatus;
    await this.membersService.updateMemberStatus(id, status);
  }

  /**
   * Retrieves all departments
   * @summary Get departments
   */
  @Get("departments")
  @Security("jwt")
  public async getDepartments(): Promise<Department[]> {
    const departments = await this.membersService.getDepartments();

    return departments;
  }

  @Put("departments/{id}")
  @Security("jwt")
  @Middlewares(checkDepartmentAccess)
  public async updateDepartment(@Path() id: number, @Body() requestBody: UpdateDepartmentRequest): Promise<void> {
    await this.membersService.updateDepartment(id, requestBody);
  }

  /**
   * Retrieves the language values
   * @summary Get languages
   */
  @Get("languages")
  @Security("jwt")
  public async getLanguages(): Promise<Value[]> {
    const languages = await this.membersService.getLanguageValues();

    return languages;
  }

  /**
   * Retrieves the edv skills
   * @summary Get edv skills
   */
  @Get("edv-skills")
  @Security("jwt")
  public async getEDVSkills(): Promise<Value[]> {
    const edvSkills = await this.membersService.getEdvSkillValues();

    return edvSkills;
  }

  /**
   * Retrieves all directors and members permission assignments
   * @summary Get permission assignments
   */
  @Get("permission-assignments")
  @Security("jwt")
  public async getPermissionAssignments(@Request() request: any): Promise<PermissionAssignment[]> {
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
   * Retrieves a list of all permissions of the member with the given ID
   * @summary Get permissions by member id
   * @param id The id of the member to retrieve the permissions from
   */
  @Get("{id}/permissions")
  @Security("jwt")
  public async getPermissionsByMemberID(
    @Path() id: number,
    @Request() request: any
  ): Promise<{ permissions: Permission[] }> {
    const user = request.user as JWTPayload;
    const userHasAnyPermission = user.permissions.length > 0;
    if (!userHasAnyPermission) {
      throw new UnauthorizedError("Authorization failed: You are not permitted to do this");
    }
    const permissions = await this.membersService.getPermissionsByMemberID(id);

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
    @Body() requestBody: AssignPermissionToMemberRequest,
    @Request() request: any
  ): Promise<void> {
    const user = request.user as JWTPayload;
    const { memberID, permissionID } = requestBody;

    // Checks if the member is allowed to delegate the permission
    if (
      !doesPermissionsInclude(user.permissions, [permissionID]) ||
      !canPermissionBeDelegated(user.permissions, permissionID)
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
    @Body() requestBody: AssignPermissionToMemberRequest,
    @Request() request: any
  ): Promise<void> {
    const user = request.user as JWTPayload;
    const { memberID, permissionID } = requestBody;

    // Checks if the member is allowed to delete the permission
    if (
      !doesPermissionsInclude(user.permissions, [permissionID]) ||
      !canPermissionBeDelegated(user.permissions, permissionID)
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
  public async getMember(@Path() id: number, @Request() request: any): Promise<MemberDetails> {
    const user = request.user;
    let userCanViewFinancialData = false;

    // Only if the user is the member to retrieve or they have the correct permissions
    // the financial data is retrieved as well
    if (id === user.mitgliedID || doesPermissionsInclude(user.permissions, [6])) {
      userCanViewFinancialData = true;
    }
    const member: MemberDetails = await this.membersService.getMemberDetails(id, userCanViewFinancialData);
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
   *   "mitgliedID": 8111,
   *   "vorname": "Brandon-Lee",
   *   "nachname": "Frye",
   *   "jbt_email": "b.frye@studentische-beratung.de",
   *   "geschlecht": 1,
   *   "geburtsdatum": "1990-06-05",
   *   "handy": "0162/9846320",
   *   "mitgliedstatus": "passives Mitglied",
   *   "generation": null,
   *   "internesprojekt": null,
   *   "trainee_seit": "2011-04-30",
   *   "mitglied_seit": "2012-11-30",
   *   "alumnus_seit": null,
   *   "senior_seit": null,
   *   "aktiv_seit": "2012-11-30",
   *   "passiv_seit": null,
   *   "ausgetreten_seit": null,
   *   "ressort": "Mitglieder",
   *   "arbeitgeber": "Versicherung Deutschland",
   *   "strasse1": "Woodsman Ave 61",
   *   "plz1": "70364",
   *   "ort1": "Stuttgart",
   *   "tel1": null,
   *   "email1": "brandon-lee@gmx.de",
   *   "strasse2": "Budapester Straße 96",
   *   "plz2": "56370",
   *   "ort2": "Rheinland-Pfalz",
   *   "tel2": "07042/984365",
   *   "email2": "brandon-lee@gmx.de",
   *   "hochschule": "Universität Hohenheim",
   *   "studiengang": "Master of Financial Management",
   *   "studienbeginn": "2014-09-30T22:00:00.000Z",
   *   "studienende": null,
   *   "vertiefungen": "Controlling und Unternehmensrechnung",
   *   "ausbildung": null,
   *   "engagement": null,
   *   "canPL": "2013-12-22",
   *   "canQM": "2013-12-22",
   *   "lastchange": "1899-11-29",
   *   "fuehrerschein": false,
   *   "ersthelferausbildung": false,
   *   "mentor": null,
   *   "mentees": [],
   *   "sprachen": [
   *     {
   *       "wert": "Deutsch",
   *       "niveau": 5
   *     },
   *     {
   *       "wert": "English",
   *       "niveau": 3
   *     },
   *     {
   *       "wert": "Französisch",
   *       "niveau": 1
   *     }
   *   ],
   *   "edvkenntnisse": [
   *     {
   *       "wert": "MS-Office",
   *       "niveau": 3
   *     },
   *     {
   *       "wert": "PHP",
   *       "niveau": 1
   *     }
   *   ]
   * }
   */
  @Patch("{id}")
  @Security("jwt")
  public async updateMember(
    @Path() id: number,
    @Body() requestBody: MemberDetails,
    @Request() request: any
  ): Promise<void> {
    const { mentor, sprachen: languages, edvkenntnisse: edvSkills, ...member } = requestBody;
    const user = request.user as JWTPayload;

    if (id === user.mitgliedID && doesPermissionsInclude(user.permissions, [1])) {
      // Grants access to all fields if member is himself and has additional permission
      await this.membersService.updateMemberDetails(id, member, mentor, languages, edvSkills, true, true);
    } else if (id === user.mitgliedID) {
      // Grants access to non critical fields to the member himself
      await this.membersService.updateMemberDetails(id, member, mentor, languages, edvSkills, false, true);
    } else if (doesPermissionsInclude(user.permissions, [1])) {
      // Grants access to critical fields for members with permission
      await this.membersService.updateMemberDetails(id, member, mentor, languages, edvSkills, true, false);
    } else {
      throw new UnauthorizedError("Authorization failed: You are not permitted to do this");
    }
  }
}
