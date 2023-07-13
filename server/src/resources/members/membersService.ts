import {
  EdvSkill,
  Language,
  Member,
  MemberDto,
  MemberPartial,
  Mentee,
  Mentor,
  UpdateDepartmentRequest,
} from "types/membersTypes";
import { NotFoundError } from "../../types/errors";
import MembersRepository from "./membersRepository";

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
  getMember = async (memberID: number, withFinancialData: boolean) => {
    const member: Member = await this.membersRepository.getMemberByID(memberID, withFinancialData);

    if (member === null) {
      throw new NotFoundError(`Member with id ${memberID} not found`);
    }

    const languages: Language[] = await this.membersRepository.getLanguagesByMemberID(memberID);
    const edvSkills: EdvSkill[] = await this.membersRepository.getEdvSkillsByMemberID(memberID);
    const mentor: Mentor = await this.membersRepository.getMentorByMemberID(memberID);
    const mentees: Mentee[] = await this.membersRepository.getMenteesByMemberID(memberID);

    // Combine the four parts for the complete member dto
    const memberDto: MemberDto = {
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
}

export default MembersService;
