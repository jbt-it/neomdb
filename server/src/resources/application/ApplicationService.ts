import fs from "fs/promises";
import path from "path";
import { AppDataSource } from "../../datasource";
import { ApplicationDto, ApplicationImageDto } from "../../types/applicationTypes";
import {
  TraineeApplicationRepository,
  TraineeApplicantHiwiRepository,
  TraineeApplicantInternshipRepository,
  TraineeApplicantLanguageRepository,
  TraineeApplicantVoluntarySchoolRepository,
  TraineeApplicantVoluntaryStudyRepository,
  TraineeApplicantItSkillRepository,
} from "./ApplicationRepository";
import { GenerationRepository } from "../../resources/trainees/GenerationRepository";
import { TraineeApplicantHiwi } from "../../entities/TraineeApplicantHiwi";
import { TraineeApplicantInternship } from "../../entities/TraineeApplicantInternship";
import { TraineeApplicantLanguage } from "../../entities/TraineeApplicantLanguage";
import { TraineeApplicantVoluntarySchool } from "../../entities/TraineeApplicantVoluntarySchool";
import { TraineeApplicantVoluntaryStudy } from "../../entities/TraineeApplicantVoluntaryStudy";
import { TraineeApplicantItSkill } from "../../entities/TraineeApplicantItSkill";

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
          gender: true,
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
          informationStand: application.informationStand ? 1 : 0,
          internet: application.internet,
          others: application.others,
          othersText: application.othersText,
          workingWeekend: application.workingWeekend,
          socialMedia: application.socialMedia ? 1 : 0,
          campusRally: application.campusRally ? 1 : 0,
          partner: application.partner ? 1 : 0,
          newsletter: application.newsletter ? 1 : 0,
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
            TraineeApplicantItSkillRepository.saveTraineeApplicantLanguage(skill, transactionalEntityManager)
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
        this.saveApplicantImage(imageFolderPath, imageName, base64);
      });
      // If everything went through, return true
      return true;
    } catch (error) {
      // Handle the error if needed
      throw new Error("Couldn't save applicant to the database.");
    }
  };
}

export default ApplicationService;
