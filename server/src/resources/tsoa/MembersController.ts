import MembersService from "../members/MembersService";
import { Get, Route, Controller } from "tsoa";
import { MemberPartial } from "../../types/membersTypes";

@Route("members")
export class MembersController extends Controller {
  private membersService: MembersService = new MembersService();

  @Get("")
  public async getMembers(): Promise<MemberPartial[]> {
    const members = await this.membersService.getMemberList();
    return members;
  }
}
