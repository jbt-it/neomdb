import { EntityManager } from "typeorm";
import { AppDataSource } from "../../datasource";
import { TraineeApplicantHiwi } from "../../entities/TraineeApplicantHiwi";
import { TraineeApplicant } from "../../entities/TraineeApplicant";
import { TraineeApplicantInternship } from "../../entities/TraineeApplicantInternship";
import { TraineeApplicantLanguage } from "../../entities/TraineeApplicantLanguage";
import { TraineeApplicantVoluntaryStudy } from "../../entities/TraineeApplicantVoluntaryStudy";
import { TraineeApplicantVoluntarySchool } from "../../entities/TraineeApplicantVoluntarySchool";
import { TraineeApplicantItSkill } from "../../entities/TraineeApplicantItSkill";
import { TraineeApplicantEvaluation } from "../../entities/TraineeApplicantEvaluation";

/**
 * Repository for the TraineeApplication entity
 */
export const TraineeApplicationRepository = AppDataSource.getRepository(TraineeApplicant).extend({
  /**
   * Retrieves all applications as a list
   * @returns A list of applications
   */
  async getApplications(generationId: number): Promise<TraineeApplicant[]> {
    return this.find({ where: { generation: generationId } });
  },

  /**
   * Retrieves an application by its id
   * @param traineeApplicantId The id of the application
   * @returns The application or null if no application was found
   */
  async getApplicationById(traineeApplicantId: number): Promise<TraineeApplicant | null> {
    return this.findOne({ where: { traineeApplicantId } });
  },

  /**
   * Retrieves all applications with evaluations by a member id
   * @param generationId The id of the generation
   * @returns A list of applications with evaluations
   */
  async getEvaluations(generationId: number): Promise<TraineeApplicant[]> {
    return this.find({
      relations: ["traineeApplicantEvaluations"],
      where: {
        generation: generationId,
      },
    });
  },

  /**
   * Save a new application to the database
   * @param application The application to save
   * @returns The saved application id
   */
  async saveApplication(application: TraineeApplicant, transactionalEntityManager?: EntityManager): Promise<number> {
    let newTraineeApplicant;
    transactionalEntityManager
      ? (newTraineeApplicant = await transactionalEntityManager.save(application))
      : (newTraineeApplicant = await this.save(application));
    return newTraineeApplicant.traineeApplicantId;
  },

  /**
   * Delete an application from the database
   * @param applicationId The id of the application to delete
   */
  async deleteApplication(applicationId: number): Promise<void> {
    return await this.delete(applicationId);
  },
});

/**
 * Repository for the TraineeApplicantHiwi entity
 */
export const TraineeApplicantHiwiRepository = AppDataSource.getRepository(TraineeApplicantHiwi).extend({
  /**
   * Save a new TraineeApplicantHiwi to the database
   * @param traineeApplicantHiwi The TraineeApplicantHiwi to save
   * @param transactionalEntityManager The transactional entity manager
   * @returns The saved TraineeApplicantHiwi
   */
  async saveTraineeApplicantHiwi(
    traineeApplicantHiwi: TraineeApplicantHiwi,
    transactionalEntityManager: EntityManager
  ): Promise<TraineeApplicantHiwi> {
    return transactionalEntityManager.save(traineeApplicantHiwi);
  },
});

/**
 * Repository for the TraineeApplicantInternship entity
 */
export const TraineeApplicantInternshipRepository = AppDataSource.getRepository(TraineeApplicantInternship).extend({
  /**
   * Save a new TraineeApplicantInternship to the database
   * @param traineeApplicantInternship The TraineeApplicantInternship to save
   * @param transactionalEntityManager The transactional entity manager
   * @returns The saved TraineeApplicantInternship
   */
  async saveTraineeApplicantInternship(
    traineeApplicantInternship: TraineeApplicantInternship,
    transactionalEntityManager: EntityManager
  ): Promise<TraineeApplicantInternship> {
    return transactionalEntityManager.save(traineeApplicantInternship);
  },
});

/**
 * Repository for the TraineeApplicantLanguage entity
 */
export const TraineeApplicantLanguageRepository = AppDataSource.getRepository(TraineeApplicantLanguage).extend({
  /**
   * Save a new TraineeApplicantLanguage to the database
   * @param traineeApplicantLanguage The TraineeApplicantLanguage to save
   * @param transactionalEntityManager The transactional entity manager
   * @returns The saved TraineeApplicantLanguage
   */
  async saveTraineeApplicantLanguage(
    traineeApplicantLanguage: TraineeApplicantLanguage,
    transactionalEntityManager: EntityManager
  ): Promise<TraineeApplicantLanguage> {
    return transactionalEntityManager.save(traineeApplicantLanguage);
  },
});

/**
 * Repository for the TraineeApplicantItSkill entity
 */
export const TraineeApplicantItSkillRepository = AppDataSource.getRepository(TraineeApplicantItSkill).extend({
  /**
   * Save a new TraineeApplicantItSkill to the database
   * @param traineeApplicantItSkill The TraineeApplicantItSkill to save
   * @param transactionalEntityManager The transactional entity manager
   * @returns The saved TraineeApplicantItSkill
   */
  async saveTraineeApplicantItSkill(
    traineeApplicantItSkill: TraineeApplicantItSkill,
    transactionalEntityManager: EntityManager
  ): Promise<TraineeApplicantItSkill> {
    return transactionalEntityManager.save(traineeApplicantItSkill);
  },
});

/**
 * Repository for the TraineeApplicantVoluntarySchool entity
 */
export const TraineeApplicantVoluntarySchoolRepository = AppDataSource.getRepository(
  TraineeApplicantVoluntarySchool
).extend({
  /**
   * Save a new TraineeApplicantVoluntarySchool to the database
   * @param traineeApplicantVoluntarySchool The TraineeApplicantVoluntarySchool to save
   * @param transactionalEntityManager The transactional entity manager
   * @returns The saved TraineeApplicantVoluntarySchool
   */
  async saveTraineeApplicantVoluntarySchool(
    traineeApplicantVoluntarySchool: TraineeApplicantVoluntarySchool,
    transactionalEntityManager: EntityManager
  ): Promise<TraineeApplicantVoluntarySchool> {
    return transactionalEntityManager.save(traineeApplicantVoluntarySchool);
  },
});

/**
 * Repository for the TraineeApplicantVoluntaryStudy entity
 */
export const TraineeApplicantVoluntaryStudyRepository = AppDataSource.getRepository(
  TraineeApplicantVoluntaryStudy
).extend({
  /**
   * Save a new TraineeApplicantVoluntaryStudy to the database
   * @param traineeApplicantVoluntaryStudy The TraineeApplicantVoluntaryStudy to save
   * @param transactionalEntityManager The transactional entity manager
   * @returns The saved TraineeApplicantVoluntaryStudy
   */
  async saveTraineeApplicantVoluntaryStudy(
    traineeApplicantVoluntaryStudy: TraineeApplicantVoluntaryStudy,
    transactionalEntityManager: EntityManager
  ): Promise<TraineeApplicantVoluntaryStudy> {
    return transactionalEntityManager.save(traineeApplicantVoluntaryStudy);
  },
});

/**
 * Repository for the TraineeApplicantEvaluation entity
 */
export const TraineeApplicantEvaluationRepository = AppDataSource.getRepository(TraineeApplicantEvaluation).extend({
  /**
   * Retrieves all evaluations of the trainee applicants
   * @param traineeApplicantId The id of the trainee applicant
   * @param memberId The id of the member
   * @returns The evaluation of the trainee applicant
   */
  async getEvaluationByTraineeApplicantIdAndMemberId(
    traineeApplicantId: number,
    memberId: number
  ): Promise<TraineeApplicantEvaluation> {
    return this.findOne({ where: { traineeApplicantId, memberId } });
  },

  /**
   * Retrieves all evaluations of one applicant
   * @param applicantId The id of the trainee applicant
   * @returns The evaluations of the trainee applicant
   */
  getApplicationById(applicantId: number): Promise<TraineeApplicantEvaluation> {
    return this.findOne({ where: { traineeApplicantId: applicantId } });
  },

  /**
   * Save a new TraineeApplicantEvaluation to the database
   * @param traineeApplicantEvaluation The TraineeApplicantEvaluation to save
   * @param transactionalEntityManager The transactional entity manager
   * @returns The saved TraineeApplicantEvaluation
   */
  async saveEvaluation(traineeApplicantEvaluation: TraineeApplicantEvaluation): Promise<TraineeApplicantEvaluation> {
    return this.save(traineeApplicantEvaluation);
  },
});
