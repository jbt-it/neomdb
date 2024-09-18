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
  getApplications(): Promise<TraineeApplicant[]> {
    return this.find();
  },

  /**
   * Retrieves an application by its id
   * @param applicationId The id of the application
   * @returns The application or null if no application was found
   */
  getApplicationById(applicationId: number): Promise<TraineeApplicant | null> {
    return this.findOne({ where: { applicationId } });
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
  saveTraineeApplicantHiwi(
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
  saveTraineeApplicantInternship(
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
  saveTraineeApplicantLanguage(
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
  saveTraineeApplicantLanguage(
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
  saveTraineeApplicantVoluntarySchool(
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
  saveTraineeApplicantVoluntaryStudy(
    traineeApplicantVoluntaryStudy: TraineeApplicantVoluntaryStudy,
    transactionalEntityManager: EntityManager
  ): Promise<TraineeApplicantVoluntaryStudy> {
    return transactionalEntityManager.save(traineeApplicantVoluntaryStudy);
  },
});
