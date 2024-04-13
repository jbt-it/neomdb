import { Department } from "typeOrm/entities/Department";
import { DepartmentDetailsDto } from "typeOrm/types/memberTypes";

export class DepartmentMapper {
  static mapDepartmentToDepartmentDetailsDto(department: Department): DepartmentDetailsDto {
    return {
      departmentId: department.departmentId,
      name: department.name,
      shortName: department.shortName,
      jbtEmail: department.jbtEmail,
      linkObjectivePresentation: department.linkObjectivePresentation,
      linkOrganigram: department.linkOrganigram,
    };
  }
}
