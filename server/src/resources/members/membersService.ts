import { EdvSkill, Language, Member, MemberDto, MemberPartial, Mentee, Mentor } from "types/membersTypes";
import { NotFoundError } from "../../types/errors";
import {
  getEdvSkillsByMemberID,
  getLanguagesByMemberID,
  getMemberByID,
  getMembers,
  getMenteesByMemberID,
  getMentorByMemberID,
} from "./membersRepository";

/**
 * Retrieves a list of all members
 */
export const getMemberList = async () => {
  const memberList: MemberPartial[] = await getMembers();

  return memberList;
};

/**
 * Retrieves a member with its langauges, edvkills, mentor and mentee by its id
 */
export const getMember = async (memberID: number, withFinancialData: boolean) => {
  const member: Member = await getMemberByID(memberID, withFinancialData);

  if (member === null) {
    throw new NotFoundError(`Member with id ${memberID} not found`);
  }

  const languages: Language[] = await getLanguagesByMemberID(memberID);
  const edvSkills: EdvSkill[] = await getEdvSkillsByMemberID(memberID);
  const mentor: Mentor = await getMentorByMemberID(memberID);
  const mentees: Mentee[] = await getMenteesByMemberID(memberID);

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
