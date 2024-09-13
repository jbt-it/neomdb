import * as bcrypt from "bcryptjs";
import fs from "fs/promises";
import path from "path";
import { GenerationRepository } from "../trainees/GenerationRepository";
import { ConflictError, NotFoundError, QueryError } from "../../types/Errors";
import { CreateMemberRequestDto, MemberDetailsDto, StatusOverview, UpdateDepartmentDto } from "../../types/memberTypes";
import { getPathOfImage } from "../../utils/assetsUtils";
import { getRandomString } from "../../utils/stringUtils";
import { DepartmentMapper } from "./DepartmentMapper";
import { DepartmentRepository } from "./DepartmentRepository";
import { MemberMapper } from "./MemberMapper";
import {
  ItSkillsRepository,
  LanguagesRepository,
  MemberHasDirectorPositionRepository,
  MemberStatusRespository,
  MembersRepository,
  PermissionsRepository,
} from "./MembersRepository";
import { PermissionMapper } from "./PermissionMapper";
import { TraineeRepository } from "resources/trainees/TraineeRepository";

/**
 * Provides methods to execute member related service functionalities
 */
class MembersService {
  /**
   * Retrieves a list of all members
   */
  getMemberList = async () => {
    const memberList = await MembersRepository.getMembersWithDepartment();
    return memberList.map((member) => MemberMapper.memberToMemberPartialDto(member));
  };

  /**
   * Retrieves a member by its id
   * @param memberID The id of the member
   */
  getMemberByID = async (memberID: number) => {
    return await MembersRepository.getMemberByID(memberID);
  };

  /**
   * Retrieves a member with its langauges, edvkills, mentor and mentee by its id
   * @throws NotFoundError if no member was found
   */
  getMemberDetails = async (memberID: number, withFinancialData: boolean) => {
    const memberDetails = await MembersRepository.getMemberDetailsByID(memberID);
    if (memberDetails === null) {
      throw new NotFoundError(`Member with id ${memberID} not found`);
    }

    return MemberMapper.membertoMemberDetailsDto(memberDetails, withFinancialData);
  };

  /**
   * Retrieves the image of a member by its id as base64 string
   * @param imageFolderPath The path to the image folder
   * @param memberID The id of the member
   * @returns The base64 string of the image and its mime type or null if no image was found
   */
  getMemberImage = async (imageFolderPath: string, memberID: number) => {
    const { imagePath, mimeType } = await getPathOfImage(imageFolderPath, `${memberID}`);
    if (imagePath === null) {
      return null;
    }

    try {
      const fileContents = await fs.readFile(imagePath);
      // Convert to Base64
      const base64 = fileContents.toString("base64");

      return { base64, mimeType };
    } catch (err: any) {
      return null;
    }
  };

  /**
   * Saves the image of a member
   * @param imageFolderPath The path to the image folder
   * @param imageName The name of the image
   * @param base64 The base64 string of the image
   */
  saveMemberImage = async (imageFolderPath: string, imageName: string, base64: string) => {
    const filePath = path.join(imageFolderPath, path.basename(`${imageName}`));

    // Convert Base64 to binary
    const fileContents = Buffer.from(base64, "base64");

    // Write file to disk
    await fs.writeFile(filePath, fileContents);
    return this.getMemberImage(imageFolderPath, parseInt(imageName));
  };

  /**
   * Retrieves a list of all members grouped by their department
   */
  getMembersOfDepartments = async () => {
    const membersOfDepartments = await MembersRepository.getActiveMembersWithDepartmentAndWithDirectorPositions();

    return membersOfDepartments.map((member) => MemberMapper.memberToDepartmentMemberDto(member));
  };

  /**
   * Retrieves all directors or only the current directors if `onlyCurrent` is true
   */
  getDirectors = async (onlyCurrent: boolean) => {
    let directors = [];
    if (onlyCurrent) {
      directors = await MemberHasDirectorPositionRepository.getCurrentDirectors();
    } else {
      directors = await MemberHasDirectorPositionRepository.getAllDirectors();
    }
    return directors.map((director) => MemberMapper.memberToDirectorDto(director));
  };

  /**
   * Retrieves all departments
   */
  getDepartments = async () => {
    const departments = await DepartmentRepository.getDepartments();

    return departments.map((department) => DepartmentMapper.departmentToDepartmentDetailsDto(department));
  };

  /**
   * Updates the department with the given id
   * @throws NotFoundError if no department was found
   */
  updateDepartment = async (departmentID: number, updateDepartmentRequest: UpdateDepartmentDto) => {
    const department = await DepartmentRepository.getDepartmentById(departmentID);

    if (department === null) {
      throw new NotFoundError(`Department with id ${departmentID} not found`);
    }

    // Update department data
    department.linkObjectivePresentation = updateDepartmentRequest.linkObjectivePresentation;
    department.linkOrganigram = updateDepartmentRequest.linkOrganigram;

    await DepartmentRepository.saveDepartment(department);
  };

  /**
   * Retrieves all language values
   */
  getLanguageValues = async () => {
    const languageValues = await LanguagesRepository.getLanguageValues();
    return languageValues;
  };

  /**
   * Retrieves all edv skill values
   */
  getEdvSkillValues = async () => {
    const edvSkillValues = await ItSkillsRepository.getItSkillValues();

    return edvSkillValues;
  };

  /**
   * Retrieves all permissions
   */
  getPermissions = async () => {
    const permissions = await PermissionsRepository.getPermissions();

    return permissions;
  };

  /**
   * Retrieves all permission assignments
   */
  getPermissionAssignments = async () => {
    const permissionAssignments = await PermissionsRepository.getPermissionWithAssignments();
    return permissionAssignments.map((permission) => PermissionMapper.permissionToPermissionAssignment(permission));
  };

  /**
   * Adds a permission to a member
   * @throws NotFoundError if the member or the permission does not exist
   */
  addPermissionToMember = async (memberID: number, permissionID: number) => {
    const memberQuery = MembersRepository.getMemberByIDWithPermissions(memberID);
    const permissionQuery = PermissionsRepository.getPermissionByID(permissionID);
    // Executing both queries concurrently
    const results = await Promise.all([memberQuery, permissionQuery]);

    const member = results[0];
    const permission = results[1];

    if (member === null) {
      throw new NotFoundError(`Member with id ${memberID} does not exist`);
    }
    if (permission === null) {
      throw new NotFoundError(`Permission with id ${permissionID} does not exist`);
    }

    member.permissions.push(permission);
    await MembersRepository.saveMember(member);
  };

  /**
   * Deletes a permission from a member
   */
  deletePermissionFromMember = async (memberID: number, permissionID: number) => {
    const memberQuery = MembersRepository.getMemberByIDWithPermissions(memberID);
    const permissionQuery = PermissionsRepository.getPermissionByID(permissionID);
    // Executing both queries concurrently
    const results = await Promise.all([memberQuery, permissionQuery]);

    const member = results[0];
    const permission = results[1];

    if (member === null) {
      throw new NotFoundError(`Member with id ${memberID} does not exist`);
    }
    if (permission === null) {
      throw new NotFoundError(`Permission with id ${permissionID} does not exist`);
    }

    member.permissions = member.permissions.filter((p) => p.permissionId !== permissionID);
    await MembersRepository.saveMember(member);
  };

  /**
   * Creates the jbtMail and username of a member
   * If the name already exists, a number is added to the name
   * @param memberName The name of the member given by the user in the request
   * @returns The new username and jbtMail
   */
  createJBTMailAndNameOfMember = async (memberName: string) => {
    // TODO: Optimize this code by using sql to set the new username and jbtMail (use count in sql)
    let jbtMail = "";
    // New user name if the name already exists
    let newUserName = "";

    // Search for memberName to check if it already exists
    const resultFirstQuery = await MembersRepository.getMemberByName(memberName);
    // Check if memberName already exists
    if (resultFirstQuery === null) {
      newUserName = memberName;
    }

    // Counter for the number of "duplicates" in the database
    let duplicateCounter = 1;
    // If name is already taken create name v.nachname1 (or v.nachname2 etc.)
    while (newUserName === "") {
      const result = await MembersRepository.getMemberByName(memberName + duplicateCounter);
      // Check if the member with the new name already exists
      if (result === null) {
        newUserName = memberName + duplicateCounter;
      }
      duplicateCounter++;
    }
    jbtMail = `${newUserName}@studentische-beratung.de`;

    return { newUserName, jbtMail };
  };

  // TODO: Add comment
  createWikiAccount = async (jbtMail: string, newUserName: string, hash: string) => {
    // TODO: Implment and test
    // createMWUser(req.body.name, hash, jbtMail);
    //               .then((mwResult: membersTypes.MWApiResult) => {
    //                 if (mwResult.status === "PASS") {
    //                   // Set the status of the mediawiki
    //                   statusOverview = {
    //                     ...statusOverview,
    //                     wikiStatus: "success",
    //                   };
    //                 } else {
    //                   statusOverview = {
    //                     ...statusOverview,
    //                     wikiErrorMsg: mwResult.message,
    //                   };
    //                 }
    //                 res.status(500).json(statusOverview);
    //               })
    //               .catch((err) => {
    //                 statusOverview = {
    //                   ...statusOverview,
    //                   wikiErrorMsg: err,
    //                 };
    //                 res.status(500).json(statusOverview);
    //               });
    //           });
    //       })
  };

  /**
   * Creates new accounts for a member
   */
  createAccountsOfMember = async (newMemberRequest: CreateMemberRequestDto, statusOverview: StatusOverview) => {
    // Create jbtMail and newUserName
    const { newUserName, jbtMail } = await this.createJBTMailAndNameOfMember(newMemberRequest.name);

    let memberId = null;
    // Create member in database
    try {
      const { ...member } = newMemberRequest;
      const password = Math.random().toString(36).slice(2, 11);
      const passwordHash = await bcrypt.hash(password, 10);
      const departmentID = 8; // Default department "Ohne Ressort"
      const statusID = 1; // Default status of member is "trainee"

      let newMember = member;
      if (member.generationId !== null) {
        // Check if the generation exists
        const generation = await GenerationRepository.getGenerationByID(member.generationId);
        if (generation === null) {
          throw new NotFoundError(`Generation with id ${member.generationId} does not exist`);
        }
      } else {
        const currentGenerationId = await GenerationRepository.getCurrentGenerationId();
        // Add the generation to the member
        newMember = { ...member, generationId: currentGenerationId };
      }
      memberId = await MembersRepository.createMember({
        ...newMember,
        name: newUserName,
        passwordHash: passwordHash,
        memberStatusId: statusID,
        jbtEmail: jbtMail,
        email2: newMember.email,
        departmentId: departmentID,
        icalToken: getRandomString(16),
        traineeSince: new Date(),
      });
      statusOverview.querySuccesful = true;

      // TODO: Add mail account creation
      // Throws a specific error if the mail account creation fails that is catched below

      // TODO: Add mail account to mailing list
      // Throws a specific error if the adding of the mail to the list fails that is catched below

      // TODO: Send Email with generated password to members new mail address

      // TODO: Add nextcloud account creation (deprecated)
      // Throws a specific error if the nextcloud account creation fails that is catched below

      // TODO: Add mediawiki account creation
      // Throws a specific error if the mediawiki account creation fails that is catched below#
      // TODO: this.createWikiAccount(jbtMail, newUserName, passwordHash);
    } catch (error) {
      /* Errors are handled centrally in the error handler middleware by default (immediately sends an error response)
       * but this is a special case because the user should be sent the status overview (for transparency)
       * therefore errors must be catched here and handled differently
       */
      if (error instanceof QueryError || error instanceof NotFoundError) {
        // Creation of member in database failed
        statusOverview.querySuccesful = false;
        statusOverview.queryErrorMsg = error.message;
      }
    }
    return { memberId, statusOverview };
  };

  /**
   * Updates details of the member with the given `memberID`
   * @param memberID The id of the member
   * @param updatedMember The updated member details
   * @param updateCritical Whether to update critical data
   * @param updatePersonal Whether to update personal data
   * @throws NotFoundError if the member does not exist
   */
  updateMemberDetails = async (
    memberID: number,
    updatedMember: MemberDetailsDto,
    updateCritical: boolean,
    updatePersonal: boolean
  ) => {
    // Check if member exists
    const member = await MembersRepository.getMemberByID(memberID);
    if (member === null) {
      throw new NotFoundError(`Member with id ${memberID} does not exist`);
    }

    // Update critical data
    if (updateCritical) {
      // Check if department exists
      const department = await DepartmentRepository.getDepartmentById(updatedMember.department.departmentId);
      if (department === null) {
        throw new NotFoundError(`Department with id ${updatedMember.department.departmentId} does not exist`);
      }

      // Check if generation exists
      const generation = await GenerationRepository.getGenerationByID(updatedMember.generation);
      if (generation === null) {
        throw new NotFoundError(`Generation with id ${updatedMember.generation} does not exist`);
      }

      // Check if member status exists
      const memberStatus = await MemberStatusRespository.getMemberStatusByID(updatedMember.memberStatus.memberStatusId);
      if (memberStatus === null) {
        throw new NotFoundError(`Member status with id ${updatedMember.memberStatus} does not exist`);
      }

      // Check if potential new mentor exists (if set)
      if (updatedMember.mentor && updatedMember.mentor.memberId !== null) {
        const mentorInDB = await MembersRepository.getMemberByID(updatedMember.mentor.memberId);
        if (mentorInDB === null) {
          throw new NotFoundError(`Mentor with id ${updatedMember.mentor?.memberId} does not exist`);
        }

        // When mentor is set, check if mentor is not the same as the member
        if (mentorInDB.memberId === memberID) {
          throw new ConflictError("Mentor cannot be the same as the member");
        }

        // When mentor is set, the mentor can be updated
        member.mentorId = updatedMember.mentor.memberId;
      }
      member.department = department;
      member.generation = generation;

      // Update the rest of the critical data
      member.memberStatus = memberStatus;
      member.traineeSince = updatedMember.traineeSince;
      member.memberSince = updatedMember.memberSince;
      member.alumnusSince = updatedMember.alumnusSince;
      member.seniorSince = updatedMember.seniorSince;
      member.passiveSince = updatedMember.passiveSince;
      member.exitedSince = updatedMember.exitedSince;
      member.commitment = updatedMember.commitment;
      member.canPL = updatedMember.canPL;
      member.canQM = updatedMember.canQM;
    }
    if (updatePersonal) {
      // Update personal data
      MemberMapper.personalMemberDetailsDtoToMember(memberID, member, updatedMember);
    }
    await MembersRepository.saveMember(member);
  };

  /**
   * Updates the status of a member
   * @throws NotFoundError if the member does not exist
   */
  updateMemberStatus = async (memberID: number, status: string) => {
    // Check if member exists
    const member = await MembersRepository.getMemberByID(memberID);
    const memberStatus = await MemberStatusRespository.getMemberStatusByName(status);

    if (member === null) {
      throw new NotFoundError(`Member with id ${memberID} does not exist`);
    }

    if (!memberStatus) {
      throw new Error("Status not found.");
    }

    if (member.memberStatus.name === status) {
      // Member already has the new status
      return;
    }

    member.memberStatus = memberStatus;
    await MembersRepository.saveMember(member);
  };
}

export default MembersService;
