import { Body, Controller, Post, Route, Tags, Get, Path, Security, Patch } from "@tsoa/runtime";
import {
  ApplicationRequestDto,
  EvaluationDto,
  FeedbackStatisticsDto,
  GenerationDto,
  NewGenerationRequestDto,
} from "../../types/applicationTypes";
import ApplicationService from "./ApplicationService";

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
  public async createNewGeneration(@Body() requestBody: NewGenerationRequestDto): Promise<GenerationDto> {
    return await this.applicationService.createNewGeneration(requestBody);
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
   * Fetches all evaluations for a member
   * @param id - The id of the member to fetch evaluations for
   * @returns EvaluationDto[]
   */
  @Get("evaluations/{id}")
  public async getEvaluationsByMemberId(@Path() id: number): Promise<EvaluationDto[]> {
    return await this.applicationService.getEvaluationByMemberId(id);
  }

  /**
   * Fetches the feedback statistics for the generation
   * @returns FeedbackStatisticsDto
   */
  @Get("feedback")
  public async getFeedback(): Promise<FeedbackStatisticsDto> {
    return await this.applicationService.getFeedbackStatistics();
  }
}
