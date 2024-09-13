import { DepartmentRepository } from "../members/DepartmentRepository";
import { MembersRepository } from "../../resources/members/MembersRepository";
import { MemberMapper } from "../../resources/members/MemberMapper";
import { MembersFieldDto, MentorDto } from "../../types/memberTypes";
import {
  InternalProjectDto,
  TraineeAssignmentDto,
  TraineeChoiceDto,
  TraineeMotivationDto,
  TraineeProgressDto,
} from "types/traineeTypes";
import { NotFoundError } from "../../types/Errors";
import { GenerationRepository } from "./GenerationRepository";
import { InternalProjectMapper } from "./InternalProjectMapper";
import InternalProjectRepository from "./InternalProjectRepository";
import { TraineeMapper } from "./TraineeMapper";
import { MemberHasWorkshopInstanceRepository, TraineeRepository } from "./TraineeRepository";
import { Generation } from "entities/Generation";

class TraineesService {
  getTraineePreferencesByGenerationID(id: number) {
    throw new Error("Method not implemented.");
  }
  /**
   * Get an internal project by its id
   * @throws NotFoundError if the internal project does not exist
   */
  getIPByID = async (id: number) => {
    const internalProject = await InternalProjectRepository.getInternalProjectByID(id);

    if (internalProject === null) {
      throw new NotFoundError(`IP with id ${id} not found`);
    }
    return InternalProjectMapper.internalProjectToInternalProjectDto(internalProject);
  };

  /**
   * Get the choices of all trainees of a generation
   * @throws NotFoundError if the generation does not exist
   */
  getTraineeChoicesByGenerationID = async (generationID: number): Promise<TraineeChoiceDto[]> => {
    const generation = await GenerationRepository.getGenerationByID(generationID);
    if (generation === null) {
      throw new NotFoundError(`Generation with id ${generationID} not found`);
    }
    return generation.members.map((choice) => TraineeMapper.traineeToTraineeChoiceDto(choice));
  };

  /**
   * Get the choices of trainee by id
   * @throws NotFoundError if the trainee does not exist
   */
  getTraineePreferencesByMemberID = async (memberID: number): Promise<TraineeChoiceDto> => {
    const choices = await TraineeRepository.getTraineePreferencesByMemberID(memberID);
    if (choices === null) {
      throw new NotFoundError(`Member with id ${memberID} not found`);
    }

    return TraineeMapper.traineeToTraineeChoiceDto(choices);
  };

  setTraineePreferencesByMemberID = async (memberID: number, preferences: TraineeChoiceDto): Promise<void> => {
    // Check if member exists
    const member = await MembersRepository.getMemberByID(memberID);
    if (member === null) {
      throw new NotFoundError(`Member with id ${memberID} does not exist`);
    }

    // Check if mentor exists
    let mentor = null;
    if (preferences.mentorChoice) {
      mentor = await MembersRepository.getMemberByID(preferences.mentorChoice);
      if (mentor === null) {
        throw new NotFoundError(`Mentor with member id ${preferences.mentorChoice} does not exist`);
      }
    }

    let mentor1 = null;
    if (preferences.mentorChoice1) {
      mentor1 = await MembersRepository.getMemberByID(preferences.mentorChoice1);
      if (mentor1 === null) {
        throw new NotFoundError(`Mentor with member id ${preferences.mentorChoice1} does not exist`);
      }
    }

    let mentor2 = null;
    if (preferences.mentorChoice2) {
      mentor2 = await MembersRepository.getMemberByID(preferences.mentorChoice2);
      if (mentor2 === null) {
        throw new NotFoundError(`Mentor with member id ${preferences.mentorChoice2} does not exist`);
      }
    }

    let mentor3 = null;
    if (preferences.mentorChoice3) {
      mentor3 = await MembersRepository.getMemberByID(preferences.mentorChoice3);
      if (mentor3 === null) {
        throw new NotFoundError(`Mentor with member id ${preferences.mentorChoice} does not exist`);
      }
    }

    // Check if department exists
    let department = null;
    if (preferences.departmentChoice) {
      department = await DepartmentRepository.getDepartmentById(preferences.departmentChoice);
      if (department === null) {
        throw new NotFoundError(`Department with id ${preferences.departmentChoice} does not exist`);
      }
    }

    let department1 = null;
    if (preferences.departmentChoice1) {
      department1 = await DepartmentRepository.getDepartmentById(preferences.departmentChoice1);
      if (department1 === null) {
        throw new NotFoundError(`Department with id ${preferences.departmentChoice1} does not exist`);
      }
    }

    let department2 = null;
    if (preferences.departmentChoice2) {
      department2 = await DepartmentRepository.getDepartmentById(preferences.departmentChoice2);
      if (department2 === null) {
        throw new NotFoundError(`Department with id ${preferences.departmentChoice2} does not exist`);
      }
    }

    let department3 = null;
    if (preferences.departmentChoice3) {
      department3 = await DepartmentRepository.getDepartmentById(preferences.departmentChoice3);
      if (department3 === null) {
        throw new NotFoundError(`Department with id ${preferences.departmentChoice3} does not exist`);
      }
    }

    // Check if internal project exists
    let internalProject = null;
    if (preferences.internalProjectChoice) {
      internalProject = await InternalProjectRepository.getInternalProjectByID(preferences.internalProjectChoice);
      if (internalProject === null) {
        throw new NotFoundError(`Internal project with id ${preferences.internalProjectChoice} does not exist`);
      }
    }

    let internalProject1 = null;
    if (preferences.internalProjectChoice1) {
      internalProject1 = await InternalProjectRepository.getInternalProjectByID(preferences.internalProjectChoice1);
      if (internalProject1 === null) {
        throw new NotFoundError(`Internal project with id ${preferences.internalProjectChoice1} does not exist`);
      }
    }

    let internalProject2 = null;
    if (preferences.internalProjectChoice2) {
      internalProject2 = await InternalProjectRepository.getInternalProjectByID(preferences.internalProjectChoice2);
      if (internalProject2 === null) {
        throw new NotFoundError(`Internal project with id ${preferences.internalProjectChoice2} does not exist`);
      }
    }

    let internalProject3 = null;
    if (preferences.internalProjectChoice3) {
      internalProject3 = await InternalProjectRepository.getInternalProjectByID(preferences.internalProjectChoice3);
      if (internalProject3 === null) {
        throw new NotFoundError(`Internal project with id ${preferences.internalProjectChoice3} does not exist`);
      }
    }

    // Mentors
    if (preferences.mentorChoice) {
      member.mentorChoice = mentor;
    }
    if (preferences.mentorChoice1) {
      member.mentorChoice1 = mentor1;
    }
    if (preferences.mentorChoice1) {
      member.mentorChoice1 = mentor1;
    }
    if (preferences.mentorChoice1) {
      member.mentorChoice1 = mentor1;
    }

    // Departments
    if (preferences.departmentChoice) {
      member.departmentChoice = department;
    }
    if (preferences.departmentChoice1) {
      member.departmentChoice1 = department1;
    }
    if (preferences.departmentChoice2) {
      member.departmentChoice2 = department2;
    }
    if (preferences.departmentChoice3) {
      member.departmentChoice3 = department3;
    }

    // Internal projects
    if (preferences.internalProjectChoice) {
      member.internalProjectChoice = internalProject;
    }
    if (preferences.internalProjectChoice1) {
      member.internalProjectChoice1 = internalProject1;
    }
    if (preferences.internalProjectChoice2) {
      member.internalProjectChoice2 = internalProject2;
    }
    if (preferences.internalProjectChoice3) {
      member.internalProjectChoice3 = internalProject3;
    }

    // Motivation
    member.choiceInternalProject1Motivation = preferences.internalProjectChoice1Motivation;
    member.choiceInternalProject2Motivation = preferences.internalProjectChoice2Motivation;
    member.choiceInternalProject3Motivation = preferences.internalProjectChoice3Motivation;

    await MembersRepository.saveMember(member);

    //await TraineeRepository.setTraineePreferencesByMemberID(memberID, preferences);
  };

  /**
   * Update an internal project by its id
   * @throws NotFoundError if the internal project does not exist
   */
  updateIPByID = async (id: number, updatedIp: InternalProjectDto): Promise<void> => {
    const ip = await InternalProjectRepository.getInternalProjectByID(id);

    if (ip === null) {
      throw new NotFoundError(`IP with id ${id} not found`);
    }

    // Fetch for the new members and quality managers of the internal project the respective Member objects
    const newQms = updatedIp.qualityManagers.map((qm) => MembersRepository.getMemberByID(qm.memberId));
    const newMembers = updatedIp.members.map((member) => MembersRepository.getMemberByID(member.memberId));

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
    await InternalProjectRepository.saveInternalProject(ip);
  };

  /**
   * Get the motivation of all trainees of a generation
   * @throws NotFoundError if the generation does not exist
   */
  getTraineeMotivationsByGenerationID = async (generationID: number): Promise<TraineeMotivationDto[]> => {
    const generation = await GenerationRepository.getGenerationByID(generationID);

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
  getGenerations = async (current: boolean): Promise<Generation[]> => {
    const generations = await GenerationRepository.getGenerations(current);

    if (generations === undefined) {
      throw new NotFoundError(`No current generation was found`);
    }
    return generations;
  };

  /**
   * Get all mentors of a generation
   * @throws NotFoundError if the generation does not exist
   */
  getMentorsByGenerationID = async (generationID: number): Promise<MentorDto[]> => {
    const generation = await GenerationRepository.getGenerationByID(generationID);

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
    const generation = await GenerationRepository.getGenerationByID(generationID);

    if (generation === null) {
      throw new NotFoundError(`Generation with id ${generationID} not found`);
    }

    if (electionStart > electionEnd) {
      throw new Error("The election start date must be before the election end date");
    }

    await GenerationRepository.updateElectionDeadline(generationID, electionStart, electionEnd);
  };

  /**
   * Updates the assignment of a trainee
   * @throws NotFoundError if the member, mentor, internal project or department does not exist
   */
  updateAssignmentByMemberID = async (memberID: number, assignment: TraineeAssignmentDto): Promise<void> => {
    // Check if the member (trainee) exists
    const member = await MembersRepository.getMemberByID(memberID);
    if (member === null) {
      throw new NotFoundError(`Member with id ${memberID} not found`);
    }

    // Check if the mentor exists
    const mentor = await MembersRepository.getMemberByID(assignment.mentorID);
    if (mentor === null) {
      throw new NotFoundError(`Mentor with id ${assignment.mentorID} not found`);
    }

    // Check if the internal project exists
    const ip = await InternalProjectRepository.getInternalProjectByID(assignment.ipID);
    if (ip === null) {
      throw new NotFoundError(`IP with id ${assignment.ipID} not found`);
    }

    // Check if the department exists
    const department = await DepartmentRepository.getDepartmentById(assignment.departmentID);
    if (department === null) {
      throw new NotFoundError(`Department with id ${assignment.departmentID} not found`);
    }

    member.internalProject = ip;
    member.mentor = mentor;
    member.department = department;

    await MembersRepository.saveMember(member);
  };

  /**
   * Adds a mentor to a generation
   * @throws NotFoundError if the generation or mentor does not exist
   */
  addMentorToGeneration = async (generationID: number, mentorID: number): Promise<void> => {
    const generation = await GenerationRepository.getGenerationByID(generationID);

    if (generation === null) {
      throw new NotFoundError(`Generation with id ${generationID} not found`);
    }

    const mentor = await MembersRepository.getMemberByID(mentorID);

    if (mentor === null) {
      throw new NotFoundError(`Mentor with id ${mentorID} not found`);
    }

    await GenerationRepository.addMentorToGeneration(generationID, mentorID);
  };

  /**
   * Get all internal projects of a generation
   * @throws NotFoundError if the generation does not exist
   */
  getInternalProjectsByGenerationID = async (generationID: number): Promise<InternalProjectDto[]> => {
    const generation = await GenerationRepository.getGenerationByID(generationID);

    if (generation === null) {
      throw new NotFoundError(`Generation with id ${generationID} not found`);
    }

    const ips = await InternalProjectRepository.getInternalProjectsByGenerationId(generationID);

    return ips.map((ip) => InternalProjectMapper.internalProjectToInternalProjectDto(ip));
  };

  /**
   * Get all trainees
   */
  getTrainees = async (): Promise<MembersFieldDto[]> => {
    const trainees = await TraineeRepository.getTrainees();

    return trainees.map((trainee) => MemberMapper.memberToMemberFieldDto(trainee));
  };

  /**
   * Get all internal projects
   * @param onlyCurrent if true, only the current internal projects are returned
   */
  getInternalProjects = async (onlyCurrent: boolean): Promise<InternalProjectDto[]> => {
    const currentGenerationId = await GenerationRepository.getCurrentGenerationId();

    // Get all internal projects or only the current ones
    const ips = onlyCurrent
      ? await InternalProjectRepository.getInternalProjectsByGenerationId(currentGenerationId)
      : await InternalProjectRepository.getAllInternalProjects();

    return ips.map((ip) => InternalProjectMapper.internalProjectToInternalProjectDto(ip));
  };

  /**
   * Get trainee internal project milestones and given feedback for obligatory workshops
   * @param generationID ID of the generation
   * @returns A promise that resolves to an array containing the combined data
   */
  getTraineeProgress = async (generationID: number): Promise<TraineeProgressDto[]> => {
    // Fetch generation to check if it exists
    const generation = await GenerationRepository.getGenerationByID(generationID);
    if (generation === null) {
      throw new NotFoundError(`Generation with id ${generationID} not found`);
    }

    // Fetch internal projects of the generation
    const internalProjects = await InternalProjectRepository.getInternalProjectsByGenerationId(generationID);

    // Holds for every member in generation a promise that resolves to the feedback of the member
    const feedbackPromises = generation.members.map(async (member) => {
      const feedback = await MemberHasWorkshopInstanceRepository.getFeedbackForMandatoryWorkshopsByMemberId(
        member.memberId
      );
      return {
        memberId: member.memberId,
        feedback: feedback,
      };
    });

    // Wait for all promises to resolve
    const allFeedback = await Promise.all(feedbackPromises);

    const traineeProgress = generation.members.map((member) => {
      // Find the feedback and internal project for the member
      const feedback = allFeedback.find((feedback) => feedback.memberId === member.memberId);
      const ip = internalProjects.find((ip) => ip.internalProjectId === member.internalProjectId);

      // Map the data to the DTO
      return TraineeMapper.traineeToTraineeProgressDto(member, generation.generationId, ip, feedback.feedback);
    });

    // Only return the trainee progress if it is not undefined
    return traineeProgress.filter((progress) => progress !== undefined) as TraineeProgressDto[];
  };
}

export default TraineesService;
