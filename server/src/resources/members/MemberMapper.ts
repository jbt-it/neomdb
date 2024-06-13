import { DirectorHasPermission } from "entities/DirectorHasPermission";
import { Department } from "../../entities/Department";
import { ItSkill } from "../../entities/ItSkill";
import { Language } from "../../entities/Language";
import { Member } from "../../entities/Member";
import { MemberHasDirectorPosition } from "../../entities/MemberHasDirectorPosition";
import { JWTPayload, PermissionDTO, User } from "../../types/authTypes";
import {
  DepartmentMemberDto,
  DepartmentPartialDto,
  DirectorDto,
  DirectorPositionDto,
  ItSkillDto,
  LanguageDto,
  MemberDetailsDto,
  MemberPartialDto,
  MemberPermissionAssignmentDto,
  MembersFieldDto,
  MenteeDto,
  MentorDto,
} from "../../types/memberTypes";

/**
 * Provides methods to map a member to a dto (data transfer object) or vice versa
 */
export class MemberMapper {
  // --- From Entity to DTO mapper functions
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
    // If the provided member is undefined, return null
    return member
      ? {
          memberId: member.memberId,
          lastname: member.lastName,
          firstname: member.firstName,
        }
      : null;
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

  static itSkillToItSkillDto(itSkill: ItSkill): ItSkillDto {
    return {
      memberId: itSkill.memberId,
      value: itSkill.value,
      level: itSkill.level,
    };
  }

  static languageToLanguageDto(language: Language): LanguageDto {
    return {
      memberId: language.memberId,
      value: language.value,
      level: language.level,
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
        generation: member.generationId ?? null,
        internalProject: member.internalProject,
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
        languages: member.languages.map((language) => this.languageToLanguageDto(language)),
        itSkills: member.itSkills.map((itSkill) => this.itSkillToItSkillDto(itSkill)),
        mentees: member.mentees.map((mentee) => this.memberToMenteeDto(mentee)),
        mentor: this.memberToMentorDto(member.mentor),
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
        generation: member.generationId ?? null,
        internalProject: member.internalProject,
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
        languages: member.languages.map((language) => this.languageToLanguageDto(language)),
        itSkills: member.itSkills.map((itSkill) => this.itSkillToItSkillDto(itSkill)),
        mentees: member.mentees.map((mentee) => this.memberToMenteeDto(mentee)),
        mentor: this.memberToMentorDto(member.mentor),
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

  // --- From DTO to Entity mapper functions

  static personalMemberDetailsDtoToMember(
    memberID: number,
    member: Member,
    memberDetailsDto: MemberDetailsDto
  ): Member {
    member.mobile = memberDetailsDto.mobile;
    member.employer = memberDetailsDto.employer;
    member.street1 = memberDetailsDto.street1;
    member.postalCode1 = memberDetailsDto.postalCode1;
    member.city1 = memberDetailsDto.city1;
    member.phone1 = memberDetailsDto.phone1;
    member.email1 = memberDetailsDto.email1;
    member.street2 = memberDetailsDto.street2;
    member.postalCode2 = memberDetailsDto.postalCode2;
    member.city2 = memberDetailsDto.city2;
    member.phone2 = memberDetailsDto.phone2;
    member.email2 = memberDetailsDto.email2;
    member.university = memberDetailsDto.university;
    member.courseOfStudy = memberDetailsDto.courseOfStudy;
    member.studyStart = memberDetailsDto.studyStart;
    member.studyEnd = memberDetailsDto.studyEnd;
    member.specializations = memberDetailsDto.specializations;
    member.apprenticeship = memberDetailsDto.apprenticeship;
    member.accountHolder = memberDetailsDto.accountHolder;
    member.iban = memberDetailsDto.iban;
    member.bic = memberDetailsDto.bic;
    member.drivingLicense = memberDetailsDto.drivingLicense;
    member.firstAidTraining = memberDetailsDto.firstAidTraining;
    member.languages =
      memberDetailsDto.languages === undefined
        ? []
        : MemberMapper.languageDtosToLanguages(memberID, memberDetailsDto.languages);
    member.itSkills =
      memberDetailsDto.itSkills === undefined
        ? []
        : MemberMapper.itSkillDtosToItSkills(memberID, memberDetailsDto.itSkills);
    return member;
  }

  static languageDtoToLanguage(memberId: number, languageDto: LanguageDto): Language {
    const language = new Language();
    language.memberId = memberId;
    language.value = languageDto.value;
    language.level = languageDto.level;
    return language;
  }
  static languageDtosToLanguages(memberId: number, languageDtos: LanguageDto[]): Language[] {
    return languageDtos.map((languageDto) => this.languageDtoToLanguage(memberId, languageDto));
  }

  static itSkillDtoToItSkill(memberId: number, itSkillDto: ItSkillDto): ItSkill {
    const itSkill = new ItSkill();
    itSkill.memberId = memberId;
    itSkill.value = itSkillDto.value;
    itSkill.level = itSkillDto.level;
    return itSkill;
  }
  static itSkillDtosToItSkills(memberId: number, itSkillDtos: ItSkillDto[]): ItSkill[] {
    return itSkillDtos.map((itSkillDto) => this.itSkillDtoToItSkill(memberId, itSkillDto));
  }
}
