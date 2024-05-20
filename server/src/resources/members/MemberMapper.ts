import { DirectorHasPermission } from "typeOrm/entities/DirectorHasPermission";
import { Department } from "../../typeOrm/entities/Department";
import { Member } from "../../typeOrm/entities/Member";
import {
  DepartmentMemberDto,
  DepartmentPartialDto,
  DirectorDto,
  DirectorPositionDto,
  MemberDetailsDto,
  MemberPartialDto,
  MemberPermissionAssignmentDto,
  MenteeDto,
  MentorDto,
  MembersFieldDto,
} from "../../typeOrm/types/memberTypes";
import { PermissionDTO, User } from "../../typeOrm/types/authTypes";
import { JWTPayload } from "../../typeOrm/types/authTypes";
import { MemberHasDirectorPosition } from "../../typeOrm/entities/MemberHasDirectorPosition";

/**
 * Provides methods to map a member to a dto (data transfer object)
 */
export class MemberMapper {
  // --- To DTO mapper functions

  static memberToJWTPayload(member: Member, directorPermissions: PermissionDTO[]): JWTPayload {
    return {
      memberId: member.memberId,
      name: member.name,
      // Combines the permissions of the member and the director permissions
      permissions: [
        // Iterate over the permissions of the member and map them to the PermissionDTO
        ...member.permissions.map((permission) => ({
          permissionId: permission.permissionId,
          canDelegate: false,
        })),
        ...directorPermissions,
      ],
      roles: member.memberHasDirectorPositions.map(
        (directorHasPermission) => directorHasPermission.director.directorId
      ),
    };
  }
  static memberToMenteeDto(member: Member): MenteeDto {
    return {
      memberId: member.memberId,
      lastname: member.lastName,
      firstname: member.firstName,
    };
  }
  static memberToMentorDto(member: Member): MentorDto {
    return {
      memberId: member.memberId,
      lastname: member.lastName,
      firstname: member.firstName,
    };
  }
  static memberToMemberFieldDto(member: Member): MembersFieldDto {
    return {
      memberId: member.memberId,
      lastname: member.lastName,
      firstname: member.firstName,
      memberStatus: member.memberStatus,
    };
  }
  static departmentToDepartmentPartialDto(department: Department): DepartmentPartialDto {
    if (!department) {
      return null;
    }
    return {
      departmentId: department.departmentId,
      name: department.name,
      shortName: department.shortName,
    };
  }
  static memberToDepartmentMemberDto(member: Member): DepartmentMemberDto {
    return {
      memberId: member.memberId,
      firstname: member.firstName,
      lastname: member.lastName,
      department: this.departmentToDepartmentPartialDto(member.department),
    };
  }
  static directorHasPermissionToDirectorPositionDto(directorHasPermission: DirectorHasPermission): DirectorPositionDto {
    return {
      directorId: directorHasPermission.directorId,
      shortName: directorHasPermission.director.shortName,
      canDelegate: directorHasPermission.canDelegate,
    };
  }
  static memberToMemberPermissionAssignmentDto(member: Member): MemberPermissionAssignmentDto {
    return {
      memberId: member.memberId,
      firstname: member.firstName,
      lastname: member.lastName,
    };
  }
  static memberToMemberPartialDto(member: Member): MemberPartialDto {
    return {
      memberId: member.memberId,
      firstname: member.firstName,
      lastname: member.lastName,
      generationId: member.generationId,
      internalProjectId: member.internalProjectId,
      mobile: member.mobile,
      jbtEmail: member.jbtEmail,
      memberStatus: member.memberStatus,
      department: this.departmentToDepartmentPartialDto(member.department),
      lastChange: member.lastChange,
    };
  }
  static memberToDirectorDto(member: MemberHasDirectorPosition): DirectorDto {
    return {
      memberId: member.memberId,
      firstname: member.member.firstName,
      lastname: member.member.lastName,
      gender: member.member.gender,
      from: member.from,
      until: member.until,
      department: this.departmentToDepartmentPartialDto(member.director.department),
      designationMale: member.director.designationMale,
      designationFemale: member.director.designationFemale,
      directorId: member.director.directorId,
    };
  }
  static membertoMemberDetailsDto(member: Member, withFinancialData: boolean): MemberDetailsDto {
    // If the user does not have the permission to see the financial data, the financial data will not be included in the response
    if (!withFinancialData) {
      return {
        memberId: member.memberId,
        lastname: member.lastName,
        firstname: member.firstName,
        gender: member.gender,
        birthday: member.birthday,
        mobile: member.mobile,
        jbtEmail: member.jbtEmail,
        memberStatus: member.memberStatus,
        generation: member.generation?.generationId,
        internalProject: member.internalProjects ? member.internalProjects[0] : null,
        traineeSince: member.traineeSince,
        memberSince: member.memberSince,
        alumnusSince: member.alumnusSince,
        seniorSince: member.seniorSince,
        activeSince: member.activeSince,
        passiveSince: member.passiveSince,
        exitedSince: member.exitedSince,
        department: this.departmentToDepartmentPartialDto(member.department),
        employer: member.employer,
        street1: member.street1,
        postalCode1: member.postalCode1,
        city1: member.city1,
        phone1: member.phone1,
        email1: member.email1,
        street2: member.street2,
        postalCode2: member.postalCode2,
        city2: member.city2,
        phone2: member.phone2,
        email2: member.email2,
        university: member.university,
        courseOfStudy: member.courseOfStudy,
        studyStart: member.studyStart,
        studyEnd: member.studyEnd,
        specializations: member.specializations,
        apprenticeship: member.apprenticeship,
        commitment: member.commitment,
        canPL: member.canPL,
        canQM: member.canQM,
        lastChange: member.lastChange,
        drivingLicense: member.drivingLicense,
        firstAidTraining: member.firstAidTraining,
        languages: member.languages,
        itSkills: member.itSkills,
        mentees: member.mentees.map((mentee) => this.memberToMenteeDto(mentee)),
        mentor: this.memberToMentorDto(member),
      };
    } else {
      return {
        memberId: member.memberId,
        lastname: member.lastName,
        firstname: member.firstName,
        gender: member.gender,
        birthday: member.birthday,
        mobile: member.mobile,
        jbtEmail: member.jbtEmail,
        memberStatus: member.memberStatus,
        generation: member.generation?.generationId,
        internalProject: member.internalProjects ? member.internalProjects[0] : null,
        traineeSince: member.traineeSince,
        memberSince: member.memberSince,
        alumnusSince: member.alumnusSince,
        seniorSince: member.seniorSince,
        activeSince: member.activeSince,
        passiveSince: member.passiveSince,
        exitedSince: member.exitedSince,
        department: this.departmentToDepartmentPartialDto(member.department),
        employer: member.employer,
        street1: member.street1,
        postalCode1: member.postalCode1,
        city1: member.city1,
        phone1: member.phone1,
        email1: member.email1,
        street2: member.street2,
        postalCode2: member.postalCode2,
        city2: member.city2,
        phone2: member.phone2,
        email2: member.email2,
        university: member.university,
        courseOfStudy: member.courseOfStudy,
        studyStart: member.studyStart,
        studyEnd: member.studyEnd,
        specializations: member.specializations,
        apprenticeship: member.apprenticeship,
        commitment: member.commitment,
        canPL: member.canPL,
        canQM: member.canQM,
        lastChange: member.lastChange,
        drivingLicense: member.drivingLicense,
        firstAidTraining: member.firstAidTraining,
        accountHolder: member.accountHolder,
        iban: member.iban,
        bic: member.bic,
        languages: member.languages,
        itSkills: member.itSkills,
        mentees: member.mentees.map((mentee) => this.memberToMenteeDto(mentee)),
        mentor: this.memberToMentorDto(member),
      };
    }
  }

  static memberToUser(member: Member): User {
    return {
      memberId: member.memberId,
      name: member.name,
      passwordHash: member.passwordHash,
      permissions: member.permissions,
    };
  }

  // --- From DTO mapper functions
}
