import { MemberPartial } from "types/membersTypes";
import { getMembers } from "./membersRepository";

/**
 * Retrieves a list of all members
 */
export const getMemberList = async () => {
  const memberList: MemberPartial[] = await getMembers();

  return memberList;
};
