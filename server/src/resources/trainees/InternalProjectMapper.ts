import { InternalProjectDto } from "../../typeOrm/types/traineeTypes";
import { InternalProject } from "../../typeOrm/entities/InternalProject";
import { MemberMapper } from "../members/MemberMapper";

/**
 * Provides methods to map a internal project to a dto (data transfer object)
 */
export class InternalProjectMapper {
  // --- To DTO mapper functions

  static internalProjectToInternalProjectDto(internalProject: InternalProject): InternalProjectDto {
    return {
      internalProjectID: internalProject.internalProjectId,
      generation: internalProject.generationId,
      generationName: internalProject.generation.description,
      projectName: internalProject.projectName,
      abbreviation: internalProject.abbreviation,
      kickoff: internalProject.kickoff,
      offerAtEv: internalProject.offerAtEv,
      zpAtEv: internalProject.zpAtEv,
      zpHeld: internalProject.zpHeld,
      apAtEv: internalProject.apAtEv,
      apHeld: internalProject.apHeld,
      dlAtEv: internalProject.dlAtEv,
      members: internalProject.members.map((member) => MemberMapper.memberToMemberFieldDto(member)),
      qualityManagers: internalProject.qualityManagers.map((qualityManager) =>
        MemberMapper.memberToMemberFieldDto(qualityManager)
      ),
    };
  }
}
