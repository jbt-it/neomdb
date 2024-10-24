import { Body, Controller, Post, Route, Tags, SuccessResponse } from "@tsoa/runtime";
import { ApplicationRequestDto } from "../../types/applicationTypes";
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
  @SuccessResponse("201", "Created")
  public async saveApplication(@Body() requestBody: ApplicationRequestDto): Promise<boolean> {
    const { application, applicationImage } = requestBody;

    return await this.applicationService.saveApplication(application, applicationImage);
  }
}
