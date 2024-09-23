import { EntityManager } from "typeorm";
import { AppDataSource } from "../../datasource";
import { TraineeApplicantHiwi } from "../../entities/TraineeApplicantHiwi";
import { TraineeApplicant } from "../../entities/TraineeApplicant";
import { TraineeApplicantInternship } from "../../entities/TraineeApplicantInternship";
import { TraineeApplicantLanguage } from "../../entities/TraineeApplicantLanguage";
import { TraineeApplicantVoluntaryStudy } from "../../entities/TraineeApplicantVoluntaryStudy";
import { TraineeApplicantVoluntarySchool } from "../../entities/TraineeApplicantVoluntarySchool";
import { TraineeApplicantItSkill } from "../../entities/TraineeApplicantItSkill";

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
   * @param applicationId The id of the application
   * @returns The application or null if no application was found
   */
  async getApplicationById(applicationId: number): Promise<TraineeApplicant | null> {
    return this.findOne({ where: { applicationId } });
  },

  /**
   * Retrieves all applications with evaluations by a member id
   * @param memberId The id of the member
   * @returns A list of applications with evaluations
   */
  async getEvaluationsByMemberId(memberId: number, generationId: number): Promise<TraineeApplicant[]> {
    return this.find({
      relations: ["traineeApplicantEvaluations"],
      where: {
        generation: generationId,
        traineeApplicantEvaluations: {
          memberId: memberId,
        },
      },
    });
  },

  /**
   * Save a new application to the database
   * @param application The application to save
   * @returns The saved application id
   */
  async saveApplication(application: TraineeApplicant, transactionalEntityManager: EntityManager): Promise<number> {
    const newTraineeApplicant = await transactionalEntityManager.save(application);
    return newTraineeApplicant.traineeApplicantId;
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
