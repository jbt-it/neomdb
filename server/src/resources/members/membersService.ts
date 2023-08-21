import {
  EdvSkill,
  Language,
  Member,
  MemberDetails,
  MemberPartial,
  Mentee,
  Mentor,
  UpdateDepartmentRequest,
} from "types/membersTypes";
import { NotFoundError } from "../../types/errors";
import MembersRepository from "./membersRepository";
import { Permission, User } from "../../types/authTypes";
import { createUserDataPayload } from "../../utils/authUtils";
import formatDate from "../../utils/dateUtils";
import { executeInTransaction } from "../../database";

/**
 * Provides methods to execute member related service functionalities
 */
class MembersService {
  membersRepository = new MembersRepository();

  /**
   * Creates a timestamp with the current date and time for the `lastChange` field
   */
  createLastChangeTimestamp = () => {
    const date: Date = new Date();
    const formattedDate = formatDate(date);

    return formattedDate;
  };

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
    const updatedLastChange = this.createLastChangeTimestamp();

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
}

export default MembersService;
