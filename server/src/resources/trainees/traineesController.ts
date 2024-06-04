import { Body, Controller, Get, Patch, Path, Post, Put, Route, Security, Tags } from "@tsoa/runtime";
import TraineesService from "./TraineesService";
import {
  InternalProjectDto,
  TraineeChoiceDto,
  TraineeMotivationDto,
  TraineeProgressDto,
  UpdateVotingDeadlinesRequestDto,
  TraineeAssignmentDto,
} from "../../typeOrm/types/traineeTypes";
import MembersService from "../members/MembersService";
import { MembersFieldDto, MentorDto } from "../../typeOrm/types/memberTypes";
import { Generation } from "../../typeOrm/entities/Generation";

/**
 * Controller for the trainees
 * Provides routes for managing trainees, internal projects and trainee assignments
 */
@Tags("Trainees")
@Route("trainees")
export class TraineesController extends Controller {
  private traineesService: TraineesService = new TraineesService();
  private membersService: MembersService = new MembersService();

  /**
   * Retrieves all current trainees
   * @summary Get current trainees
   * @param id id of the generation
   */
  @Get("")
  @Security("jwt")
  public async getTrainees(): Promise<MembersFieldDto[]> {
    const trainees = await this.traineesService.getTrainees();
    return trainees;
  }

  /**
   * Retrieves a single internal project by id
   * @summary Get an internal project
   * @param id id of the internal project
   */
  @Get("ip/{id}")
  @Security("jwt")
  public async getIP(@Path() id: number): Promise<InternalProjectDto> {
    const ip = this.traineesService.getIPByID(id);

    return ip;
  }

  /**
   * Retrieves choices of mentor, internal project and department of all trainees of given generation
   * @summary Get trainee choices
   * @param id id of the generation
   */
  @Get("generations/{id}/trainee-choices")
  @Security("jwt", ["14"])
  public async getTraineeChoicesOfGeneration(@Path() id: number): Promise<TraineeChoiceDto[]> {
    const choices = await this.traineesService.getTraineeChoicesByGenerationID(id);

    return choices;
  }

  /**
   * Updates an internal project by id
   * @summary Update an internal project
   * @param id id of the internal project
   * @param requestBody updated internal project
   *
   * @example requestBody {
   *  "DLBeiEV": true,
   *  "APGehalten": "2021-01-01",
   *  "APBeiEV": true,
   *  "ZPGehalten": "2021-01-01",
   *  "ZPBeiEV": true,
   *  "AngebotBeiEV": true,
   *  "kickoff": "2021-01-01",
   *  "kuerzel": "string",
   *  "projektname": "string-long",
   *  "generationsBezeichnung": "Wintersemester 19/20",
   *  "generation": 15,
   *  "internesProjektID": 62,
   *  "projektmitglieder": [
   *    {
   *     "mitgliedID": 8478,
   *     "vorname": "Kellan",
   *     "nachname": "Mclaughlin"
   *    },
   *    {
   *     "mitgliedID": 8748,
   *     "vorname": "Mason",
   *     "nachname": "Vinson"
   *    }
   *   ],
   *  "qualitaetsmanager": [
   *    {
   *     "mitgliedID": 8320,
   *     "vorname": "Radhika",
   *     "nachname": "Norton"
   *    },
   *    {
   *     "mitgliedID": 8333,
   *     "vorname": "Miruna",
   *     "nachname": "Decker"
   *    }
   *   ]
   * }
   *
   */
  @Put("ip/{id}")
  @Security("jwt", ["15"])
  public async updateIP(@Path() id: number, @Body() requestBody: InternalProjectDto): Promise<void> {
    await this.traineesService.updateIPByID(id, requestBody);
  }

  /**
   * Retrieves information about all generations
   * @summary Get generations
   */
  @Get("generations")
  @Security("jwt")
  public async getGenerations(): Promise<Generation[]> {
    const generations = await this.traineesService.getGenerations();

    return generations;
  }

  /**
   * Gets letter of motivation form trainees of given generation
   * @summary Get trainee motivations
   * @param id id of the generation
   */
  @Get("generations/{id}/motivation")
  @Security("jwt", ["14"])
  public async getTraineeMotivation(@Path() id: number): Promise<TraineeMotivationDto[]> {
    const motivation = await this.traineesService.getTraineeMotivationsByGenerationID(id);

    return motivation;
  }

  /**
   * Sets "wahl_start" and "wahl_ende" for generation
   * @summary Set voting deadline
   * @param id id of the generation
   * @param requestBody start and end date of the voting
   *
   * @example requestBody {
   * "electionStart": "2021-01-01 18:00:00",
   * "electionEnd": "2021-01-31 20:00:00"
   * }
   */
  @Post("generations/{id}/set-deadline")
  @Security("jwt", ["14"])
  public async setElectionDeadline(
    @Path() id: number,
    @Body() requestBody: UpdateVotingDeadlinesRequestDto
  ): Promise<void> {
    await this.traineesService.updateElectionDeadline(id, requestBody.electionStart, requestBody.electionEnd);
  }

  /**
   * Sets choices of internesprojekt, mentor and department of member
   * @summary Set trainee assignment
   * @param id id of the trainee
   * @param requestBody assignment of the trainee
   *
   * @example requestBody {
   * "ipID": 62,
   * "mentorID": 8167,
   * "departmentID": 1
   * }
   */
  // TODO: Use @Post("{id}/assignment") instead of @Patch("{id}/assignment")
  @Patch("{id}/assignment")
  @Security("jwt", ["14"])
  public async setTraineeAssignment(@Path() id: number, @Body() requestBody: TraineeAssignmentDto): Promise<void> {
    await this.traineesService.updateAssignmentByMemberID(id, requestBody);
  }

  /**
   * Retrieves all internal projects of a generation
   * @summary Get internal projects
   * @param id id of the generation
   */
  @Get("generations/{id}/mentors")
  @Security("jwt", ["14"])
  public async getMentorsOfGeneration(@Path() id: number): Promise<MentorDto[]> {
    const mentors = await this.traineesService.getMentorsByGenerationID(id);

    return mentors;
  }

  /**
   * Adds a mentor to a generation
   * @summary Add mentor
   * @param id id of the generation
   * @param memberID id of the mentor
   */
  @Post("generations/{id}/add-mentor/{memberID}")
  @Security("jwt", ["14"])
  public async addMentor(@Path() id: number, @Path() memberID: number): Promise<void> {
    await this.traineesService.addMentorToGeneration(id, memberID);
  }

  /**
   * Retrieves all internal projects of a generation
   * @summary Get internal projects
   * @param id id of the generation
   */
  @Get("generations/{id}/internal-projects")
  @Security("jwt", ["14"])
  public async getInternalProjectsOfGeneration(@Path() id: number): Promise<InternalProjectDto[]> {
    const internalProjects = await this.traineesService.getInternalProjectsByGenerationID(id);

    return internalProjects;
  }

  /**
   * Retrieves all current IPs
   * @summary Get current IPs
   */
  @Get("ips/current")
  @Security("jwt")
  public async getCurrentIPs(): Promise<InternalProjectDto[]> {
    const ips = await this.traineesService.getInternalProjects(true);

    return ips;
  }

  /**
   * Retrieves all IPs
   * @summary Get all IPs
   */
  @Get("ips/all")
  @Security("jwt")
  public async getAllIPs(): Promise<InternalProjectDto[]> {
    const ips = await this.traineesService.getInternalProjects(false);

    return ips;
  }

  /**
   * Retrieves all milestones of internal projects and workshop feedback of a generation
   * @summary Get progress of the trainee generation
   * @param id id of the generation
   */
  @Get("generations/{id}/trainee-progress")
  @Security("jwt", ["14"])
  public async getTraineeProgress(@Path() id: number): Promise<TraineeProgressDto[]> {
    const traineeProgress = await this.traineesService.getTraineeProgress(id);

    return traineeProgress;
  }

  /**
   * Admits a trainee which sets the active since state of the member to the current date and
   * updates the member status
   * @summary Admit a trainee
   * @param id id of the trainee
   */
  @Post("admission/{id}")
  @Security("jwt", ["18"])
  public async admitTrainee(@Path() id: number): Promise<void> {
    await this.membersService.updateMemberStatus(id, "aktives Mitglied");
  }
}
