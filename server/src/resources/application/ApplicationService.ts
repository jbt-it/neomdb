import fs from "fs/promises";
import path from "path";
import { AppDataSource } from "../../datasource";
import {
  ApplicationDto,
  ApplicationImageDto,
  TraineeEvaluationDto,
  FeedbackStatisticsDto,
  GenerationDto,
  NewGenerationRequestDto,
} from "../../types/applicationTypes";
import {
  TraineeApplicationRepository,
  TraineeApplicantHiwiRepository,
  TraineeApplicantInternshipRepository,
  TraineeApplicantLanguageRepository,
  TraineeApplicantVoluntarySchoolRepository,
  TraineeApplicantVoluntaryStudyRepository,
  TraineeApplicantItSkillRepository,
  TraineeApplicantEvaluationRepository,
} from "./ApplicationRepository";
import { GenerationRepository } from "../trainees/GenerationRepository";
import { TraineeApplicantHiwi } from "../../entities/TraineeApplicantHiwi";
import { TraineeApplicantInternship } from "../../entities/TraineeApplicantInternship";
import { TraineeApplicantLanguage } from "../../entities/TraineeApplicantLanguage";
import { TraineeApplicantVoluntarySchool } from "../../entities/TraineeApplicantVoluntarySchool";
import { TraineeApplicantVoluntaryStudy } from "../../entities/TraineeApplicantVoluntaryStudy";
import { TraineeApplicantItSkill } from "../../entities/TraineeApplicantItSkill";
import { NotFoundError } from "../../types/Errors";
import { ApplicationMapper } from "./ApplicationMapper";
import { TraineeApplicantEvaluation } from "../../entities/TraineeApplicantEvaluation";

/**
 * Service for the application
 */
class ApplicationService {
  private assetsPath = process.env.ASSETS_PATH || (process.env.NODE_ENV === "test" ? "./test/assets" : "./assets");

  /**
   * Save the applicant image to the file system
   * @param imageFolderPath - The path to the image folder
   * @param imageName - The name of the image
   * @param base64 - The base64 encoded image
   */
  saveApplicantImage = async (imageFolderPath: string, imageName: string, base64: string) => {
    const filePath = path.join(imageFolderPath, path.basename(`${imageName}`));

    // Convert Base64 to binary
    const fileContents = Buffer.from(base64, "base64");

    // Write file to disk
    await fs.writeFile(filePath, fileContents);
  };

  /**
   * Save the application
   * @param application - The application to save
   * @param applicationImage - The image of the application
   */
  saveApplication = async (application: ApplicationDto, applicationImage: ApplicationImageDto) => {
    try {
      // initiate a transaction
      await AppDataSource.transaction(async (transactionalEntityManager) => {
        // Initialize the applicant id
        let applicantId: number | null = null;

        // Get the current generation id
        const generationId = await GenerationRepository.getCurrentGenerationId();

        // Create a new applicant
        const newApplicant = TraineeApplicationRepository.create({
          generation: generationId,
          applicationDate: new Date(),
          firstName: application.firstName,
          lastName: application.lastName,
          gender: application.gender,
          picture: application.picture,
          birthDate: application.birthDate,
          mobilePhone: application.mobilePhone,
          email: application.email,
          homeAddressStreet: application.homeAddressStreet,
          homeAddressNumber: application.homeAddressNumber,
          homeAddressPostalCode: application.homeAddressPostalCode,
          homeAddressCity: application.homeAddressCity,
          studyAddressStreet: application.studyAddressStreet,
          studyAddressNumber: application.studyAddressNumber,
          studyAddressPostalCode: application.studyAddressPostalCode,
          studyAddressCity: application.studyAddressCity,
          enrolledDegree: application.enrolledDegree,
          enrolledUniversity: application.enrolledUniversity,
          enrolledSubject: application.enrolledSubject,
          enrolledOtherSubject: application.enrolledOtherSubject,
          studyStart: application.studyStart,
          studySemester: application.studySemester,
          studyFirstMajor: application.studyFirstMajor,
          studySecondMajor: application.studySecondMajor,
          studyThirdMajor: application.studyThirdMajor,
          bachelorSubject: application.bachelorSubject,
          bachelorUniversity: application.bachelorUniversity,
          apprenticeshipJob: application.apprenticeshipJob,
          apprenticeshipCompany: application.apprenticeshipCompany,
          apprenticeshipLocation: application.apprenticeshipLocation,
          apprenticeshipStart: application.apprenticeshipStart,
          apprenticeshipEnd: application.apprenticeshipEnd,
          occupation: application.occupation,
          occupationCompany: application.occupationCompany,
          occupationLocation: application.occupationLocation,
          occupationStart: application.occupationStart,
          occupationEnd: application.occupationEnd,
          hobbies: application.hobbies,
          timeInvestment: application.timeInvestment,
          motivation: application.motivation,
          selfAssessment1: application.selfAssessment1,
          selfAssessment2: application.selfAssessment2,
          selfAssessment3: application.selfAssessment3,
          selfAssessment4: application.selfAssessment4,
          selfAssessment5: application.selfAssessment5,
          selfAssessment6: application.selfAssessment6,
          selfAssessment7: application.selfAssessment7,
          selfAssessment8: application.selfAssessment8,
          flyer: application.flyer,
          posters: application.posters,
          lectures: application.lectures,
          friends: application.friends,
          informationStand: application.informationStand,
          internet: application.internet,
          others: application.others,
          othersText: application.othersText,
          workingWeekend: application.workingWeekend,
          socialMedia: application.socialMedia,
          campusRally: application.campusRally,
          partner: application.partner,
          newsletter: application.newsletter,
          availabilitySelectionWeekend: application.availabilitySelectionWeekend,
        });

        // Save the application to the database
        applicantId = await TraineeApplicationRepository.saveApplication(newApplicant, transactionalEntityManager);

        // Create the related entities
        const applicantHiwiJobs: TraineeApplicantHiwi[] = [];
        const applicantInterships: TraineeApplicantInternship[] = [];
        const applicantLanguages: TraineeApplicantLanguage[] = [];
        const applicantItSkills: TraineeApplicantItSkill[] = [];
        const applicantVoluntarySchools: TraineeApplicantVoluntarySchool[] = [];
        const applicantVoluntaryStudies: TraineeApplicantVoluntaryStudy[] = [];

        // create a new hiwi job and push it to the array if there are hiwi jobs
        if (application.hiwiStudentJob.length > 0) {
          application.hiwiStudentJob.map((job) => {
            const newHiwiJob = TraineeApplicantHiwiRepository.create({
              traineeApplicantId: applicantId,
              activity: job.activity,
              company: job.company,
              location: job.location,
              start: job.start,
              end: job.end,
            });
            applicantHiwiJobs.push(newHiwiJob);
          });
        }

        // create a new internship and push it to the array if there are internships
        if (application.internship.length > 0) {
          application.internship.map((internship) => {
            const newInternship = TraineeApplicantInternshipRepository.create({
              traineeApplicantId: applicantId,
              activity: internship.activity,
              company: internship.company,
              location: internship.location,
              start: internship.start,
              end: internship.end,
            });
            applicantInterships.push(newInternship);
          });
        }

        // create a new language and push it to the array if there are languages
        if (application.languages.length > 0) {
          application.languages.map((language) => {
            const newLanguage = TraineeApplicantLanguageRepository.create({
              traineeApplicantId: applicantId,
              language: language.name,
              languageLevel: language.level,
            });
            applicantLanguages.push(newLanguage);
          });
        }

        // create a new it skill and push it to the array if there are it skills
        if (application.itSkills.length > 0) {
          application.itSkills.map((skill) => {
            const newSkill = TraineeApplicantItSkillRepository.create({
              traineeApplicantId: applicantId,
              skillName: skill.name,
              skillLevel: skill.level,
            });
            applicantItSkills.push(newSkill);
          });
        }

        // create a new voluntary school and push it to the array if there are voluntary schools
        if (application.voluntarySchool.length > 0) {
          application.voluntarySchool.map((activity) => {
            const newSchool = TraineeApplicantVoluntarySchoolRepository.create({
              traineeApplicantId: applicantId,
              activity: activity,
            });
            applicantVoluntarySchools.push(newSchool);
          });
        }

        // create a new voluntary study and push it to the array if there are voluntary studies
        if (application.voluntaryStudy.length > 0) {
          application.voluntaryStudy.map((activity) => {
            const newStudy = TraineeApplicantVoluntaryStudyRepository.create({
              traineeApplicantId: applicantId,
              activity: activity,
            });
            applicantVoluntaryStudies.push(newStudy);
          });
        }

        // Save the hiwi job entities to the database if some exist
        if (applicantHiwiJobs.length > 0) {
          applicantHiwiJobs.map((job) =>
            TraineeApplicantHiwiRepository.saveTraineeApplicantHiwi(job, transactionalEntityManager)
          );
        }

        // Save the internship entities to the database if some exist
        if (applicantInterships.length > 0) {
          applicantInterships.map((internship) =>
            TraineeApplicantInternshipRepository.saveTraineeApplicantInternship(internship, transactionalEntityManager)
          );
        }

        // Save the language entities to the database if some exist
        if (applicantLanguages.length > 0) {
          applicantLanguages.map((language) =>
            TraineeApplicantLanguageRepository.saveTraineeApplicantLanguage(language, transactionalEntityManager)
          );
        }

        // Save the it skill entities to the database if some exist
        if (applicantItSkills.length > 0) {
          applicantItSkills.map((skill) =>
            TraineeApplicantItSkillRepository.saveTraineeApplicantItSkill(skill, transactionalEntityManager)
          );
        }

        // Save the voluntary school entities to the database if some exist
        if (applicantVoluntarySchools.length > 0) {
          applicantVoluntarySchools.map((school) =>
            TraineeApplicantVoluntarySchoolRepository.saveTraineeApplicantVoluntarySchool(
              school,
              transactionalEntityManager
            )
          );
        }

        // Save the voluntary study entities to the database if some exist
        if (applicantVoluntaryStudies.length > 0) {
          applicantVoluntaryStudies.map((study) =>
            TraineeApplicantVoluntaryStudyRepository.saveTraineeApplicantVoluntaryStudy(
              study,
              transactionalEntityManager
            )
          );
        }

        // create the image folder path
        const imageFolderPath = `${this.assetsPath}/applicants`;
        // get the base64 image
        const base64 = applicationImage.base64;
        // create the image name
        const imageName = `${application.firstName}_${application.lastName}_${applicantId}.${applicationImage.mimeType}`;

        // save the image to the file system
        await this.saveApplicantImage(imageFolderPath, imageName, base64);
      });
      // If everything went through, return true
      return true;
    } catch (error) {
      // Handle the error if needed
      console.error("Error saving application:", error);
      throw new Error("Couldn't save applicant to the database.");
    }
  };

  /**
   * Get the current generation
   * @returns The current generation
   */
  getCurrentGeneration = async (): Promise<GenerationDto> => {
    try {
      // get the current generation id
      const generationId = await GenerationRepository.getCurrentGenerationId();

      // get the current generation by its id
      const generation = await GenerationRepository.getGenerationByID(generationId);

      if (generation !== null) {
        return ApplicationMapper.generationToGenerationDto(generation);
      } else {
        throw new NotFoundError(`Generation with id ${generationId} not found`);
      }
    } catch (error) {
      console.error("Error getting current generation:", error);
      throw new Error("Couldn't get current generation");
    }
  };

  /**
   * Create a new generation
   * @param generationRequest - The generation request
   * @returns The new generation
   */
  createNewGeneration = async (generationRequest: NewGenerationRequestDto): Promise<GenerationDto> => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    // construct the description of the generation
    const newDescription =
      new Date().getMonth() < 8
        ? `Sommersemester ${currentYear}`
        : `Wintersemester ${currentYear.toString().slice(-2)}/${nextYear.toString().slice(-2)}`;

    try {
      // create a new Generation object
      const newGeneration = GenerationRepository.create({
        description: newDescription,
        applicationStart: generationRequest.applicationStart,
        applicationEnd: generationRequest.applicationEnd,
        selectionWeDateStart: generationRequest.selectionWeDateStart,
        selectionWeDateEnd: generationRequest.selectionWeDateEnd,
        wwDateStart: generationRequest.wwDateStart,
        wwDateEnd: generationRequest.wwDateEnd,
      });

      // save the generation to the database
      const generation = await GenerationRepository.save(newGeneration);
      return ApplicationMapper.generationToGenerationDto(generation);
    } catch (error) {
      console.error("Error creating new generation:", error);
      throw new Error("Couldn't create new generation");
    }
  };

  /**
   * Update a generation by its id
   * @param generationRequest - The generation request
   * @returns The updated generation
   */
  updateGeneration = async (generationRequest: GenerationDto): Promise<GenerationDto> => {
    const generation = await GenerationRepository.getGenerationByID(generationRequest.generationId);

    if (generation !== null) {
      generation.applicationStart = generationRequest.applicationStart;
      generation.applicationEnd = generationRequest.applicationEnd;
      generation.selectionWeDateStart = generationRequest.selectionWeDateStart;
      generation.selectionWeDateEnd = generationRequest.selectionWeDateEnd;
      generation.wwDateStart = generationRequest.wwDateStart;
      generation.wwDateEnd = generationRequest.wwDateEnd;
      generation.doorCode = generationRequest.doorCode;
      generation.electionStart = generationRequest.electionStart;
      generation.electionEnd = generationRequest.electionEnd;
      generation.infoEveningVisitors = generationRequest.infoEveningVisitors;

      // save the updated generation to the database
      const updatedGeneration = await GenerationRepository.save(generation);
      return ApplicationMapper.generationToGenerationDto(updatedGeneration);
    } else {
      throw new NotFoundError(`Generation with id ${generationRequest.generationId} not found`);
    }
  };

  /**
   * Get all trainee applicant evaluations by member id
   * @returns A list of evaluations
   */
  getEvaluations = async (): Promise<TraineeEvaluationDto[]> => {
    try {
      // get the current generation id
      const generationId = await GenerationRepository.getCurrentGenerationId();

      // get all trainee applicants with evaluations
      const traineeApplicantWithEvaluations = await TraineeApplicationRepository.getEvaluations(generationId);

      // map the trainee applicants to TraineeEvaluationDto
      const evaluations = traineeApplicantWithEvaluations.map((applicant) => {
        return ApplicationMapper.traineeApplicantToEvaluationDto(applicant);
      });

      return evaluations;
    } catch (error) {
      console.error("Error getting evaluations by member id:", error);
      throw new Error("Couldn't get evaluations by member id");
    }
  };

  /**
   * Get the feedback statistics
   * @returns The feedback statistics
   */
  getFeedbackStatistics = async (): Promise<FeedbackStatisticsDto> => {
    try {
      // get the current generationId
      const generationId = await GenerationRepository.getCurrentGenerationId();

      // get all trainee applicants for the current generation
      const traineeApplicants = await TraineeApplicationRepository.getApplications(generationId);

      const flyerStatistic = traineeApplicants.filter((applicant) => applicant.flyer).length;
      const postersStatistic = traineeApplicants.filter((applicant) => applicant.posters).length;
      const lecturesStatistic = traineeApplicants.filter((applicant) => applicant.lectures).length;
      const friendsStatistic = traineeApplicants.filter((applicant) => applicant.friends).length;
      const informationStandStatistic = traineeApplicants.filter((applicant) => applicant.informationStand).length;
      const internetStatistic = traineeApplicants.filter((applicant) => applicant.internet).length;
      const othersStatistic = traineeApplicants.filter((applicant) => applicant.others).length;
      const socialMediaStatistic = traineeApplicants.filter((applicant) => applicant.socialMedia).length;
      const campusRallyStatistic = traineeApplicants.filter((applicant) => applicant.campusRally).length;
      const partnerStatistic = traineeApplicants.filter((applicant) => applicant.partner).length;
      const newsletterStatistic = traineeApplicants.filter((applicant) => applicant.newsletter).length;
      const othersText = traineeApplicants
        .filter((applicant) => applicant.others)
        .map((applicant) => {
          return applicant.othersText;
        });

      // Create the feedback statistics object
      const feedbackStatistics = {
        flyer: flyerStatistic,
        posters: postersStatistic,
        lectures: lecturesStatistic,
        friends: friendsStatistic,
        informationStand: informationStandStatistic,
        internet: internetStatistic,
        socialMedia: socialMediaStatistic,
        campusRally: campusRallyStatistic,
        partner: partnerStatistic,
        newsletter: newsletterStatistic,
        others: othersStatistic,
        othersText: othersText,
        totalApplicants: traineeApplicants.length,
      };
      return feedbackStatistics;
    } catch (error) {
      console.error("Error getting feedback statistics:", error);
      throw new Error("Couldn't get feedback statistics");
    }
  };

  /**
   * Change the rating of an application
   * @param id - The id of the application
   * @param rating - The new rating
   * @returns True if the rating was changed
   */
  changeApplicationEvaluation = async (
    id: number,
    rating: number | null,
    memberId: number
  ): Promise<TraineeApplicantEvaluation> => {
    try {
      // get the application by its id
      const evaluation = await TraineeApplicantEvaluationRepository.getEvaluationByTraineeApplicantIdAndMemberId(
        id,
        memberId
      );

      // if the trainee applicant exists with an evaluation of the member change the rating
      if (evaluation !== null) {
        if (rating === null) {
          // delete the evaluation if the rating is null
          await TraineeApplicantEvaluationRepository.deleteEvaluation(id, memberId);
          return;
        }
        // update the rating of the application
        evaluation.evaluation = rating;

        // save the updated application to the database
        return await TraineeApplicantEvaluationRepository.saveEvaluation(evaluation);
      } else {
        const newEvaluation = TraineeApplicantEvaluationRepository.create({
          traineeApplicantId: id,
          memberId: memberId,
          evaluation: rating,
        });

        // save the evaluation to the database
        return await TraineeApplicantEvaluationRepository.save(newEvaluation);
      }
    } catch (error) {
      console.error("Error changing application rating:", error);
      throw new Error("Couldn't change application rating");
    }
  };

  /**
   * Delete an application by its id
   * @param id - The id of the application
   * @returns True if the application was deleted
   */
  deleteApplication = async (id: number): Promise<boolean> => {
    try {
      // get the application by its id
      const application = await TraineeApplicationRepository.getApplicationById(id);

      // if the application exists
      if (application !== null) {
        // delete the application by its id
        await TraineeApplicationRepository.deleteApplication(application.traineeApplicantId);
        return true;
      } else {
        throw new NotFoundError(`Application with id ${id} not found`);
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      throw new Error("Couldn't delete application");
    }
  };
}

export default ApplicationService;
