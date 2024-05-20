import { NotFoundError } from "../../types/Errors";
import InternalProjectRepository_typeORM from "./InternalProjectRepository_typeORM";
import { TraineeRepository_typeORM } from "./TraineeRepository_typeORM";
import { GenerationRepository_typeORM } from "./GenerationRepository_typeORM";
import { InteralProjectMapper } from "./InteralProjectMapper";
import {
  TraineeChoiceDto,
  InternalProjectDto,
  TraineeMotivationDto,
  TraineeAssignmentDto,
  TraineeProgressDto,
} from "../../typeOrm/types/traineeTypes";
import { MemberMapper } from "../../resources/members/MemberMapper";
import { TraineeMapper } from "./TraineeMapper";
import { MembersRepository_typeORM } from "../../resources/members/MembersRepository_typeORM";
import { MembersFieldDto, MentorDto } from "../../typeOrm/types/memberTypes";
import { Generation } from "../../typeOrm/entities/Generation";
import { AppDataSource } from "../../datasource";
import { DepartmentRepository_typeORM } from "../../resources/members/DepartmentRepository_typeORM";

class TraineesService {
  /**
   * Get an internal project by its id
   * @throws NotFoundError if the internal project does not exist
   */
  getIPByID = async (id: number) => {
    const internalProject = await InternalProjectRepository_typeORM.getIPByID(id);

    if (internalProject === null) {
      throw new NotFoundError(`IP with id ${id} not found`);
    }
    return InteralProjectMapper.internalProjectToInternalProjectDto(internalProject);
  };

  /**
   * Get the choices of all trainees of a generation
   * @throws NotFoundError if the generation does not exist
   */
  getTraineeChoicesByGenerationID = async (generationID: number): Promise<TraineeChoiceDto[]> => {
    const generation = await GenerationRepository_typeORM.getGenerationByID(generationID);
    if (generation === null) {
      throw new NotFoundError(`Generation with id ${generationID} not found`);
    }
    return generation.members.map((choice) => TraineeMapper.memberToTraineeChoiceDto(choice));
  };

  /**
   * Update an internal project by its id
   * @throws NotFoundError if the internal project does not exist
   */
  updateIPByID = async (id: number, updatedIp: InternalProjectDto): Promise<void> => {
    // Update the internal project in a transaction
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const ip = await InternalProjectRepository_typeORM.getIPByID(id);

      if (ip === null) {
        throw new NotFoundError(`IP with id ${id} not found`);
      }

      const ipMembers = await TraineeRepository_typeORM.getInternalProjectMembersByID(id);
      // Get the memberIDs of the updated and old internal project
      const ipMemberIDs = updatedIp.members.map((member) => member.memberId);
      const oldIPMemberIDs = ipMembers
        .filter((member) => ipMemberIDs.includes(member.memberId) === false)
        .map((member) => member.memberId);

      // Fetch for the new members and quality managers of the internal project the respective Member objects
      const newQms = updatedIp.qualityManagers.map((qm) => MembersRepository_typeORM.getMemberByID(qm.memberId));
      const newMembers = updatedIp.members.map((member) => MembersRepository_typeORM.getMemberByID(member.memberId));

      // Change the internal project details based on the updated IP
      ip.projectName = updatedIp.projectName;
      ip.abbreviation = updatedIp.abbreviation;
      ip.kickoff = updatedIp.kickoff;
      ip.offerAtEv = updatedIp.offerAtEv;
      ip.zpAtEv = updatedIp.zpAtEv;
      ip.zpHeld = updatedIp.zpHeld;
      ip.apAtEv = updatedIp.apAtEv;
      ip.apHeld = updatedIp.apHeld;
      ip.dlAtEv = updatedIp.dlAtEv;
      ip.generationId = updatedIp.generation;
      ip.qualityManagers = await Promise.all(newQms);
      ip.members = await Promise.all(newMembers);

      // Update the IP details with members and qms
      await InternalProjectRepository_typeORM.updateIPDetailsByID(ip, transactionalEntityManager);

      // Remove the old members from the IP
      const removeOldMembersPromises = oldIPMemberIDs.map((memberID) =>
        TraineeRepository_typeORM.updateIPMembers(null, memberID, transactionalEntityManager)
      );
      await Promise.all(removeOldMembersPromises);
    });
  };

  /**
   * Get the motivation of all trainees of a generation
   * @throws NotFoundError if the generation does not exist
   */
  getTraineeMotivationsByGenerationID = async (generationID: number): Promise<TraineeMotivationDto[]> => {
    const generation = await GenerationRepository_typeORM.getGenerationByID(generationID);

    if (generation === null) {
      throw new NotFoundError(`Generation with id ${generationID} not found`);
    }

    const motivations = generation.members.map((member) => {
      return TraineeMapper.traineeToMotivationDto(member);
    });

    return motivations;
  };

  /**
   * Get all generations
   */
  getGenerations = async (): Promise<Generation[]> => {
    const generations = await GenerationRepository_typeORM.getGenerations();

    return generations;
  };

  /**
   * Get all mentors of a generation
   * @throws NotFoundError if the generation does not exist
   */
  getMentorsByGenerationID = async (generationID: number): Promise<MentorDto[]> => {
    const generation = await GenerationRepository_typeORM.getGenerationByID(generationID);

    if (generation === null) {
      throw new NotFoundError(`Generation with id ${generationID} not found`);
    }

    const mentors = generation.mentors.map((mentor) => {
      return MemberMapper.memberToMentorDto(mentor);
    });

    return mentors;
  };

  /**
   * Updates the voting deadline of a generation
   * @throws NotFoundError if the generation does not exist
   * @throws Error if the election start date is after the election end date
   */
  updateElectionDeadline = async (generationID: number, electionStart: Date, electionEnd: Date): Promise<void> => {
    const generation = await GenerationRepository_typeORM.getGenerationByID(generationID);

    if (generation === null) {
      throw new NotFoundError(`Generation with id ${generationID} not found`);
    }

    if (electionStart > electionEnd) {
      throw new Error("The election start date must be before the election end date");
    }

    await GenerationRepository_typeORM.updateElectionDeadline(generationID, electionStart, electionEnd);
  };

  /**
   * Updates the assignment of a trainee
   * @throws NotFoundError if the member, mentor, internal project or department does not exist
   */
  updateAssignmentByMemberID = async (memberID: number, assignment: TraineeAssignmentDto): Promise<void> => {
    // Check if the member (trainee) exists
    const member = await MembersRepository_typeORM.getMemberByID(memberID);
    if (member === null) {
      throw new NotFoundError(`Member with id ${memberID} not found`);
    }

    // Check if the mentor exists
    const mentor = await MembersRepository_typeORM.getMemberByID(assignment.mentorID);
    if (mentor === null) {
      throw new NotFoundError(`Mentor with id ${assignment.mentorID} not found`);
    }

    // Check if the internal project exists
    const ip = await InternalProjectRepository_typeORM.getIPByID(assignment.ipID);
    if (ip === null) {
      throw new NotFoundError(`IP with id ${assignment.ipID} not found`);
    }

    // Check if the department exists
    const department = await DepartmentRepository_typeORM.getDepartmentById(assignment.departmentID);
    if (department === null) {
      throw new NotFoundError(`Department with id ${assignment.departmentID} not found`);
    }

    await TraineeRepository_typeORM.updateAssignmentByMemberID(memberID, assignment.ipID, mentor, department);
  };

  /**
   * Adds a mentor to a generation
   * @throws NotFoundError if the generation or mentor does not exist
   */
  addMentorToGeneration = async (generationID: number, mentorID: number): Promise<void> => {
    const generation = await GenerationRepository_typeORM.getGenerationByID(generationID);

    if (generation === null) {
      throw new NotFoundError(`Generation with id ${generationID} not found`);
    }

    const mentor = await MembersRepository_typeORM.getMemberByID(mentorID);

    if (mentor === null) {
      throw new NotFoundError(`Mentor with id ${mentorID} not found`);
    }

    await GenerationRepository_typeORM.addMentorToGeneration(generationID, mentorID);
  };

  /**
   * Get all internal projects of a generation
   * @throws NotFoundError if the generation does not exist
   */
  getInternalProjectsByGenerationID = async (generationID: number): Promise<InternalProjectDto[]> => {
    const generation = await GenerationRepository_typeORM.getGenerationByID(generationID);

    if (generation === null) {
      throw new NotFoundError(`Generation with id ${generationID} not found`);
    }

    const ips = await InternalProjectRepository_typeORM.getInternalProjectsByGenerationId(generationID);

    const internalProjects = ips.map((ip) => {
      return InteralProjectMapper.internalProjectToInternalProjectDto(ip);
    });

    return internalProjects;
  };

  /**
   * Get all trainees
   */
  getTrainees = async (): Promise<MembersFieldDto[]> => {
    const trainees = await TraineeRepository_typeORM.getTrainees();

    return trainees.map((trainee) => MemberMapper.memberToMemberFieldDto(trainee));
  };

  /**
   * Get all internal projects
   * @param onlyCurrent if true, only the current internal projects are returned
   */
  getInternalProjects = async (onlyCurrent: boolean): Promise<InternalProjectDto[]> => {
    const currentGenerationId = await GenerationRepository_typeORM.getCurrentGenerationId();

    // Get all internal projects or only the current ones
    const ips = onlyCurrent
      ? await InternalProjectRepository_typeORM.getInternalProjectsByGenerationId(currentGenerationId)
      : await InternalProjectRepository_typeORM.getAllInternalProjects();

    const internalProjects = ips.map((ip) => {
      return InteralProjectMapper.internalProjectToInternalProjectDto(ip);
    });

    return internalProjects;
  };

  /**
   * Get trainee internal project milestones and given feedback for obligatory workshops
   * @param generationID ID of the generation
   * @returns A promise that resolves to an array containing the combined data
   */
  getTraineeProgress = async (generationID: number): Promise<TraineeProgressDto[]> => {
    // Fetch generation to check if it exists
    const generation = await GenerationRepository_typeORM.getGenerationByID(generationID);
    if (generation === null) {
      throw new NotFoundError(`Generation with id ${generationID} not found`);
    }

    // fetch internal projects of the generation
    const internalProjects = await InternalProjectRepository_typeORM.getInternalProjectsByGenerationId(generationID);

    // Fetch feedback for mandatory workshops for all members
    const feedbackPromises = generation.members.map(async (member) => {
      const feedback = await TraineeRepository_typeORM.checkFeedbackForMandatoryWorkshops(member.memberId);
      return {
        memberId: member.memberId,
        feedback: feedback,
      };
    });

    // Wait for all promises to resolve
    const allFeedback = await Promise.all(feedbackPromises);

    // Map the data to the DTO
    const traineeProgress = generation.members.map((member) => {
      // Find the feedback and internal project for the member
      const feedback = allFeedback.find((feedback) => feedback.memberId === member.memberId);
      const ip = internalProjects.find((ip) => ip.internalProjectId === member.internalProjectId);

      // If the member has no feedback or internal project, return undefined
      // TODO: throw error or log warning?
      if (!ip || !feedback) {
        return;
      }
      return TraineeMapper.traineeToTraineeProgressDto(member, generation.generationId, ip, feedback.feedback);
    });

    return traineeProgress.filter((progress) => progress !== undefined) as TraineeProgressDto[];
  };
}

export default TraineesService;
