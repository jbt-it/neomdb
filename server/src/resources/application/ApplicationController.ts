import {
  Body,
  Controller,
  Post,
  Route,
  Tags,
  Get,
  Path,
  Security,
  Patch,
  SuccessResponse,
  Delete,
} from "@tsoa/runtime";
import {
  ApplicationRequestDto,
  ChangeRatingDto,
  TraineeEvaluationDto,
  FeedbackStatisticsDto,
  GenerationDto,
  NewGenerationRequestDto,
} from "../../types/applicationTypes";
import ApplicationService from "./ApplicationService";
import { TraineeApplicantEvaluation } from "../../entities/TraineeApplicantEvaluation";

/**
 * Controller for the applicaion module
 * Provides routes for saving and fetching applications
 */
@Tags("Application")
@Route("application")
export class ApplicationController extends Controller {
  private applicationService: ApplicationService = new ApplicationService();

  /**
   * Saves a new application to the database
   * @param requestBody - The application to save and the image to save as ApplicationRequestDto
   * @summary Saves a new application to the database
   * @returns void
   */
  @Post("")
  @SuccessResponse("201", "Created")
  public async saveApplication(@Body() requestBody: ApplicationRequestDto): Promise<boolean> {
    const { application, applicationImage } = requestBody;

    return await this.applicationService.saveApplication(application, applicationImage);
  }

  /**
   * Creates a new generation in the database
   * @param requestBody - The generation to create as NewGenerationRequestDto
   * @returns the created generation as GenerationDto
   */
  @Post("generation")
  @Security("jwt", ["16"])
  @SuccessResponse("201", "Created")
  public async createNewGeneration(@Body() requestBody: NewGenerationRequestDto): Promise<GenerationDto> {
    return await this.applicationService.createNewGeneration(requestBody);
  }

  /**
   * Fetches the current generation from the database
   * @returns GenerationDto
   */
  @Get("generation")
  @Security("jwt", ["9"])
  public async getCurrentGeneration(): Promise<GenerationDto> {
    return await this.applicationService.getCurrentGeneration();
  }

  /**
   * Updates a generation in the database
   * @param requestBody - The generation to update as GenerationDto
   * @returns the updated generation as GenerationDto
   */
  @Patch("generation")
  @Security("jwt", ["16"])
  public async updateGeneration(@Body() requestBody: GenerationDto): Promise<GenerationDto> {
    return await this.applicationService.updateGeneration(requestBody);
  }

  /**
   * Fetches all evaluations of the trainee applicants
   * @returns TraineeEvaluationDto[]
   */
  @Get("evaluations")
  @Security("jwt", ["9"])
  public async getEvaluationsByMemberId(): Promise<TraineeEvaluationDto[]> {
    return await this.applicationService.getEvaluations();
  }

  /**
   * Fetches the feedback statistics for the generation
   * @returns FeedbackStatisticsDto
   */
  @Get("feedback")
  @Security("jwt", ["9"])
  public async getFeedback(): Promise<FeedbackStatisticsDto> {
    return await this.applicationService.getFeedbackStatistics();
  }

  /**
   * Changes the rating of an application by a member
   * @param id - The id of the application to change the rating for
   * @param rating - The new rating to set
   * @param memberId - The id of the member changing the rating
   * @returns void
   */
  @Post("/evaluations/{id}")
  @Security("jwt", ["9"])
  public async changeApplicationEvaluation(
    @Path() id: number,
    @Body() createRatingDto: ChangeRatingDto
  ): Promise<TraineeApplicantEvaluation> {
    const { evaluation, memberId } = createRatingDto;
    return await this.applicationService.changeApplicationEvaluation(id, evaluation, memberId);
  }

  /**
   * Deletes an application from the database
   * @param id - The id of the application to delete
   * @returns void
   */
  @Delete("{id}")
  @Security("jwt", ["16"])
  public async deleteApplication(@Path() id: number): Promise<boolean> {
    return await this.applicationService.deleteApplication(id);
  }
}
