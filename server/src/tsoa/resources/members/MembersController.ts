import MembersService from "../../../resources/members/MembersService";
import { Get, Route, Controller, Security, Tags } from "tsoa";
import { MemberPartial } from "../../../types/membersTypes";

/**
 * Controller for the members module
 * Provides routes for retrieving, creating and updating members, departments and permissions
 */
@Tags("Members")
@Route("members")
export class MembersController extends Controller {
  private membersService: MembersService = new MembersService();

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
}
