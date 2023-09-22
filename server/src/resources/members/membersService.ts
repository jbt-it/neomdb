import {
  CreateMemberRequest,
  EdvSkill,
  Language,
  Member,
  MemberDetails,
  MemberPartial,
  Mentee,
  Mentor,
  NewMember,
  StatusOverview,
  UpdateDepartmentRequest,
} from "types/membersTypes";
import { NotFoundError, QueryError } from "../../types/errors";
import MembersRepository from "./MembersRepository";
import { Permission, User } from "../../types/authTypes";
import { createUserDataPayload } from "../../utils/authUtils";
import { createCurrentTimestamp } from "../../utils/dateUtils";
import { executeInTransaction } from "../../database";
import bcrypt = require("bcryptjs");
import { getRandomString } from "../../utils/stringUtils";

/**
 * Provides methods to execute member related service functionalities
 */
class MembersService {
  membersRepository = new MembersRepository();

  /**
   * Retrieves a list of all members
   */
  getMemberList = async () => {
    const memberList: MemberPartial[] = await this.membersRepository.getMembers();

    return memberList;
  };

  /**
   * Retrieves a member with its langauges, edvkills, mentor and mentee by its id
   * @throws NotFoundError if no member was found
   */
  getMemberDetails = async (memberID: number, withFinancialData: boolean) => {
    const member: Member = await this.membersRepository.getMemberByID(memberID, withFinancialData);

    if (member === null) {
      throw new NotFoundError(`Member with id ${memberID} not found`);
    }

    const languages: Language[] = await this.membersRepository.getLanguagesByMemberID(memberID);
    const edvSkills: EdvSkill[] = await this.membersRepository.getEdvSkillsByMemberID(memberID);
    const mentor: Mentor = await this.membersRepository.getMentorByMemberID(memberID);
    const mentees: Mentee[] = await this.membersRepository.getMenteesByMemberID(memberID);

    // Combine the four parts for the complete member dto
    const memberDto: MemberDetails = {
      ...member,
      mentor,
      mentees,
      sprachen: languages,
      edvkenntnisse: edvSkills,
    };
    return memberDto;
  };

  /**
   * Retrieves a list of all members grouped by their department
   */
  getMembersOfDepartments = async () => {
    const membersOfDepartments = await this.membersRepository.getMembersGroupedByDepartment();

    return membersOfDepartments;
  };

  /**
   * Retrieves all directors or only the current directors if `onlyCurrent` is true
   */
  getDirectors = async (onlyCurrent: boolean) => {
    const directors = await this.membersRepository.getDirectors(onlyCurrent);

    return directors;
  };

  /**
   * Retrieves all departments
   */
  getDepartments = async () => {
    const departments = await this.membersRepository.getDepartments();

    return departments;
  };

  /**
   * Updates the department with the given id
   * @throws NotFoundError if no department was found
   */
  updateDepartment = async (departmentID: number, updateDepartmentRequest: UpdateDepartmentRequest) => {
    const department = await this.membersRepository.getDepartmentByID(departmentID);

    if (department === null) {
      throw new NotFoundError(`Department with id ${departmentID} not found`);
    }

    await this.membersRepository.updateDepartmentByID(
      departmentID,
      updateDepartmentRequest.linkOrganigramm,
      updateDepartmentRequest.linkZielvorstellung
    );
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
    const user: User = await this.membersRepository.getUserByID(memberID);

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
    const permissionQuery = this.membersRepository.getDepartmentByID(permissionID);
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
    let jbtMail = "";
    // New user name if the name already exists
    let newUserName = "";

    // Search for memberName to check if it already exists
    const resultFirstQuery = await this.membersRepository.getUserByName(memberName);
    // Check if memberName already exists
    if (resultFirstQuery === null) {
      newUserName = memberName;
    }

    // Counter for the number of "duplicates" in the database
    let duplicateCounter = 1;
    // If name is already taken create name v.nachname1 (or v.nachname2 etc.)
    while (newUserName === "") {
      const result = await this.membersRepository.getUserByName(memberName + duplicateCounter);
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
      const { password: newPassword, ...newMember } = newMemberRequest;
      const passwordHash = await bcrypt.hash(newPassword, 10);
      const departmentID = 8; // Default department "Ohne Ressort"
      const statusID = 1; // Default status of member is "trainee"
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

      // TODO: Add nextcloud account creation (deprecated)
      // Throws a specific error if the nextcloud account creation fails that is catched below

      // TODO: Add mediawiki account creation
      // Throws a specific error if the mediawiki account creation fails that is catched below#
      // TODO: this.createWikiAccount(jbtMail, newUserName, passwordHash);
    } catch (error) {
      /* Errors are handled centrally in the error handler middleware by default (immediately sends an error response)
       * but this is a special case, because the user should be sent the status overview (for transparency)
       * therefore errors must be catched here and handled differently
       */
      if (error instanceof QueryError) {
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
    const member = this.membersRepository.getMemberByID(memberID, false);
    if (member === null) {
      throw new NotFoundError(`Member with id ${memberID} does not exist`);
    }
    // Check if potential new mentor exists (if set)
    if (mentor.mitgliedID !== null) {
      const mentorInDB = this.membersRepository.getMentorByMemberID(mentor.mitgliedID);
      if (mentorInDB === null) {
        throw new NotFoundError(`Mentor with id ${mentor.mitgliedID} does not exist`);
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
  updateMemberStatus = async (memberID: number, status: string) => {
    // Check if member exists
    const member = this.membersRepository.getMemberByID(memberID, false);
    if (member === null) {
      throw new NotFoundError(`Member with id ${memberID} does not exist`);
    }

    const lastChangeTime = createCurrentTimestamp();
    await this.membersRepository.updateMemberStatusByID(memberID, lastChangeTime, status);
  };
}

export default MembersService;
