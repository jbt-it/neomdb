import MembersService from "../members/MembersService";
import { Get, Route, Controller, Security, Request } from "tsoa";
import { MemberPartial } from "../../types/membersTypes";

/**
 * Controller for the members module
 * Provides routes for retrieving, creating and updating members, departments and permissions
 */
@Route("members")
export class MembersController extends Controller {
  private membersService: MembersService = new MembersService();

  /**
   * Get a list of all members
   */
  @Get("")
  @Security("jwt")
  public async getMembers(): Promise<MemberPartial[]> {
    const members = await this.membersService.getMemberList();
    return members;
  }
}
