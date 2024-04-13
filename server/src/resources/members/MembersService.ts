import * as bcrypt from "bcryptjs";
import fs from "fs/promises";
import path from "path";
import AuthRepository from "../../auth/AuthRepository";
import { executeInTransaction } from "../../database";
import { NotFoundError, QueryError } from "../../types/Errors";
import { Permission, User } from "../../types/authTypes";
import {
  CreateMemberRequest,
  EdvSkill,
  Language,
  Member,
  MemberStatus,
  Mentor,
  NewMember,
  StatusOverview,
  UpdateDepartmentDto,
} from "../../types/membersTypes";
import { getPathOfImage } from "../../utils/assetsUtils";
import { createUserDataPayload } from "../../utils/authUtils";
import { createCurrentTimestamp } from "../../utils/dateUtils";
import { getRandomString } from "../../utils/stringUtils";
import TraineesRepository from "../trainees/TraineesRepository";
import { DepartmentRepository_typeORM } from "./DepartmentRepository_typeORM";
import { MemberMapper } from "./MemberMapper";
import MembersRepository from "./MembersRepository";
import { MembersRepository_typeORM } from "./MembersRepository_typeORM";
import { DepartmentMapper } from "./DepartmentMapper";

/**
 * Provides methods to execute member related service functionalities
 */
class MembersService {
  membersRepository = new MembersRepository();
  traineesRepository = new TraineesRepository();
  authRepository = new AuthRepository();

  /**
   * Retrieves a list of all members
   */
  getMemberList = async () => {
    const memberList = await MembersRepository_typeORM.getMembersWithDepartment();
    return memberList.map((member) => MemberMapper.memberToMemberPartialDto(member));
  };

  /**
   * Retrieves a member with its langauges, edvkills, mentor and mentee by its id
   * @throws NotFoundError if no member was found
   */
  getMemberDetails = async (memberID: number, withFinancialData: boolean) => {
    const memberDetails = await MembersRepository_typeORM.getMemberDetailsByID(memberID);
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
  };

  /**
   * Retrieves a list of all members grouped by their department
   */
  getMembersOfDepartments = async () => {
    const membersOfDepartments2 =
      await MembersRepository_typeORM.getActiveMembersWithDepartmentAndWithDirectorPositions();
    return membersOfDepartments2.map((member) => MemberMapper.memberToDepartmentMemberDto(member));
  };

  /**
   * Retrieves all directors or only the current directors if `onlyCurrent` is true
   */
  getDirectors = async (onlyCurrent: boolean) => {
    let directors = [];
    if (onlyCurrent) {
      directors = await MembersRepository_typeORM.getCurrentDirectors();
    } else {
      directors = await MembersRepository_typeORM.getAllDirectors();
    }

    return directors.map((director) => MemberMapper.memberToDirectorDto(director));
  };

  /**
   * Retrieves all departments
   */
  getDepartments = async () => {
    const departments = await DepartmentRepository_typeORM.getDepartments();

    return departments.map((department) => DepartmentMapper.mapDepartmentToDepartmentDetailsDto(department));
  };

  /**
   * Updates the department with the given id
   * @throws NotFoundError if no department was found
   */
  updateDepartment = async (departmentID: number, updateDepartmentRequest: UpdateDepartmentDto) => {
    const department = await DepartmentRepository_typeORM.getDepartmentById(departmentID);

    if (department === null) {
      throw new NotFoundError(`Department with id ${departmentID} not found`);
    }

    // Update department data
    department.linkObjectivePresentation = updateDepartmentRequest.linkObjectivePresentation;
    department.linkOrganigram = updateDepartmentRequest.linkOrganigram;

    await DepartmentRepository_typeORM.saveDepartment(department);
  };

  /**
   * Retrieves all language values
   */
  getLanguageValues = async () => {
    const languageValues = await this.membersRepository.getLanguageValues();

    return languageValues;
  };

  /**
   * Retrieves all edv skill values
   */
  getEdvSkillValues = async () => {
    const edvSkillValues = await this.membersRepository.getEdvSkillValues();

    return edvSkillValues;
  };

  /**
   * Retrieves all permissions
   */
  getPermissions = async () => {
    const permissions = await this.membersRepository.getPermissions();

    return permissions;
  };

  /**
   * Retrieves all permission assignments
   */
  getPermissionAssignments = async () => {
    const permissionAssignments = await this.membersRepository.getPermissionAssignments();

    return permissionAssignments;
  };

  /**
   * Retrieves permissions of a member with the given `memberID`
   */
  getPermissionsByMemberID = async (memberID: number) => {
    const user: User = await this.authRepository.getUserByID(memberID);

    if (user === null) {
      throw new NotFoundError(`No member found with id ${memberID}`);
    }

    const directorPermissions: Permission[] = await this.membersRepository.getDirectorPermissionsByMemberID(memberID);

    const payload = createUserDataPayload(user, directorPermissions);
    const permissions = { permissions: payload.permissions };

    return permissions;
  };

  /**
   * Adds a permission to a member
   * @throws NotFoundError if the member or the permission does not exist
   */
  addPermissionToMember = async (memberID: number, permissionID: number) => {
    const memberQuery = this.membersRepository.getMemberByID(memberID, false);
    const permissionQuery = this.membersRepository.getPermissionByID(permissionID);
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

    await this.membersRepository.addPermissionToMember(memberID, permissionID);
  };

  /**
   * Retrieves all permissions of a member
   */
  deletePermissionFromMember = async (memberID: number, permissionID: number) => {
    await this.membersRepository.deletePermissionFromMember(memberID, permissionID);
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
    const resultFirstQuery = await this.authRepository.getUserByName(memberName);
    // Check if memberName already exists
    if (resultFirstQuery === null) {
      newUserName = memberName;
    }

    // Counter for the number of "duplicates" in the database
    let duplicateCounter = 1;
    // If name is already taken create name v.nachname1 (or v.nachname2 etc.)
    while (newUserName === "") {
      const result = await this.authRepository.getUserByName(memberName + duplicateCounter);
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
  createAccountsOfMember = async (newMemberRequest: CreateMemberRequest, statusOverview: StatusOverview) => {
    // Create jbtMail and newUserName
    const { newUserName, jbtMail } = await this.createJBTMailAndNameOfMember(newMemberRequest.name);

    let memberID = null;
    // Create member in database
    try {
      const { password: newPassword, ...member } = newMemberRequest;
      const passwordHash = await bcrypt.hash(newPassword, 10);
      const departmentID = 8; // Default department "Ohne Ressort"
      const statusID = 1; // Default status of member is "trainee"

      let newMember = member;
      if (member.generation !== null) {
        // Check if the generation exists
        const generation = await this.traineesRepository.getGenerationByID(member.generation);
        if (generation === null) {
          throw new NotFoundError(`Generation with id ${member.generation} does not exist`);
        }
      } else {
        // Retrieve the generations and select the newest one
        const generations = await this.traineesRepository.getGenerations();
        // Because the generations are sorted descending by date, the first element is the newest one
        const newestGeneration = generations[0];
        // Add the generation to the member
        newMember = { ...member, generation: newestGeneration.generationID };
      }

      memberID = await this.membersRepository.createMember(
        newMember as NewMember,
        newUserName,
        passwordHash,
        statusID,
        getRandomString(16),
        jbtMail,
        departmentID
      );
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
    return { memberID, statusOverview };
  };

  /**
   * Updates details of the member with the given `memberID`
   * @param memberID The id of the member
   * @param updatedMember The updated member data
   * @param mentor The updated mentor data
   * @param updatedLanguages The updated languages
   * @param updatedEdvSkills The updated edv skills
   * @param updateCritical Whether to update critical data
   * @param updatePersonal Whether to update personal data
   * @throws NotFoundError if the member does not exist
   */
  updateMemberDetails = async (
    memberID: number,
    updatedMember: Member,
    mentor: Mentor,
    updatedLanguages: Language[],
    updatedEdvSkills: EdvSkill[],
    updateCritical: boolean,
    updatePersonal: boolean
  ) => {
    // Check if member exists
    const member = await this.membersRepository.getMemberByID(memberID, false);
    if (member === null) {
      throw new NotFoundError(`Member with id ${memberID} does not exist`);
    }
    // Check if potential new mentor exists (if set)
    if (mentor && mentor.mitgliedID !== null) {
      const mentorInDB = this.membersRepository.getMentorByMemberID(mentor.mitgliedID);
      if (mentorInDB === null) {
        throw new NotFoundError(`Mentor with id ${mentor?.mitgliedID} does not exist`);
      }
    }

    // Create timestamp for last change
    const updatedLastChange = createCurrentTimestamp();

    // Fill tasks to be executed in transaction
    const tasks = [];
    if (updateCritical) {
      // Add update tasks for critical data
      tasks.push({
        func: this.membersRepository.updateMemberCriticalDataByID,
        args: [memberID, updatedMember, mentor],
      });
    }
    if (updatePersonal) {
      // Add update tasks for personal data
      tasks.push({
        func: this.membersRepository.updateMemberPersonalDataByID,
        args: [memberID, updatedMember, updatedLastChange],
      });
      // Add update tasks for languages and edv skills
      tasks.push({
        func: this.membersRepository.updateMemberLanguagesByID,
        args: [memberID, updatedLanguages],
      });
      tasks.push({
        func: this.membersRepository.updateMemberEdvSkillsByID,
        args: [memberID, updatedEdvSkills],
      });
    }

    // Execute all tasks in transaction
    await executeInTransaction(tasks);
  };

  /**
   * Updates the status of a member
   * @throws NotFoundError if the member does not exist
   */
  updateMemberStatus = async (memberID: number, status: MemberStatus) => {
    // Check if member exists
    const member = await this.membersRepository.getMemberByID(memberID, false);
    if (member === null) {
      throw new NotFoundError(`Member with id ${memberID} does not exist`);
    }

    if (member.mitgliedstatus === status) {
      // Member already has the new status
      return;
    }

    const lastChangeTime = createCurrentTimestamp();
    await this.membersRepository.updateMemberStatusByID(memberID, lastChangeTime, status);
  };
}

export default MembersService;
