import { InternalProjectDto } from "../../typeOrm/types/traineeTypes";
import { InternalProject } from "../../typeOrm/entities/InternalProject";
import { Generation } from "../../typeOrm/entities/Generation";
import { Member } from "../../typeOrm/entities/Member";
import { MemberMapper } from "../../resources/members/MemberMapper";

/**
 * Provides methods to map a internal project to a dto (data transfer object)
 */
export class InteralProjectMapper {
  // --- To DTO mapper functions

  static internalProjectToInternalProjectDto(
    internalProject: InternalProject,
    generation: Generation,
    members: Member[]
  ): InternalProjectDto {
    return {
      internalProjectID: internalProject.internalProjectId,
      generation: internalProject.generation,
      generationName: generation.description,
      projectName: internalProject.projectName,
      abbreviation: internalProject.abbreviation,
      kickoff: internalProject.kickoff,
      offerAtEv: internalProject.offerAtEv,
      zpAtEv: internalProject.zpAtEv,
      zpHeld: internalProject.zpHeld,
      apAtEv: internalProject.apAtEv,
      apHeld: internalProject.apHeld,
      dlAtEv: internalProject.dlAtEv,
      members: members.map((member) => MemberMapper.memberToMemberFieldDto(member)),
      qualityManagers: internalProject.qualityManagers.map((qualityManager) =>
        MemberMapper.memberToMemberFieldDto(qualityManager)
      ),
    };
  }
}
