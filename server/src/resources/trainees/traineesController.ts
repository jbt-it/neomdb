/**
 * Definition of the handler functions for the members module
 */
import { Request, Response } from "express";
import { checkForSQLKeywords } from "../../utils/stringUtils";
import database = require("../../database");
import TraineesService from "./TraineesService";
import { InternalProject, TraineeAssignment } from "../../types/traineesTypes";

const traineesService = new TraineesService();

/**
 * Retrieves a single internal project
 */
export const retrieveIP = async (req: Request, res: Response): Promise<Response> => {
  const ipID = parseInt(req.params.id);
  const ip = await traineesService.getIPByID(ipID);

  return res.status(200).json(ip);
};

/**
 * Retrieves choices of mentor, internal project and department of all trainees of given generation
 * @param {Request} req request object
 * @param {number} req.params.id ID of generation
 * @param res member ID, first and last name and choices
 */
export const retrieveTraineeChoices = async (req: Request, res: Response): Promise<Response> => {
  const generationID = parseInt(req.params.id);
  const choices = await traineesService.getTraineeChoicesByGenerationID(generationID);

  return res.status(200).json(choices);
};

/**
 * Updates an internal project
 */
export const updateIP = async (req: Request, res: Response): Promise<Response> => {
  const ipID = parseInt(req.params.id);
  const updatedIp = req.body as InternalProject;

  await traineesService.updateIPByID(ipID, updatedIp);

  return res.status(200).send("Updated IP");
};

/**
 * Retrieves the mails for the specified internal projects
 */
export const retrieveTeamMails = async (req: Request, res: Response): Promise<Response> => {
  const ipID = parseInt(req.params.id);
  const mails = await traineesService.getTraineeMailsByIpID(ipID);

  return res.status(200).json(mails);
};

/*
 * Gets letter of motivation form trainees of given generation
 * @param {Request} req request object
 * @param {number} req.body.generationID
 * @param res member ID and 3 motivation texts
 */
export const retrieveTraineeMotivation = async (req: Request, res: Response): Promise<Response> => {
  const generationID = parseInt(req.params.id);
  const motivation = await traineesService.getTraineeMotivationsByGenerationID(generationID);

  return res.status(200).json(motivation);
};

/**
 * Retrieves information about all generations
 * @param {Request} req empty request object
 * @param res generationID, short name and deadlines
 */
export const retrieveGenerations = async (req: Request, res: Response): Promise<Response> => {
  const generations = await traineesService.getGenerations();

  return res.status(200).json(generations);
};

/**
 * Sets "wahl_start" and "wahl_ende" for generation
 * @param {Request} req request object
 * @param {Date} req.body.votingStart
 * @param {Date} req.body.votingEnd
 * @param {number} req.params.id ID of generation
 * @param res status code and message
 */
export const setVotingDeadline = async (req: Request, res: Response): Promise<Response> => {
  const generationID = parseInt(req.params.id);
  const votingStart = req.body.votingStart as string; // TODO: Date
  const votingEnd = req.body.votingEnd as string; // TODO: Date

  await traineesService.updateVotingDeadline(generationID, votingStart, votingEnd);

  return res.status(200).send("Updated voting deadline");
};

/**
 * Sets choices of internesprojekt, mentor and ressort of member
 * @param {Request} req request object
 * @param {number} req.body.internesprojektID
 * @param {number} req.body.mentorID
 * @param {number} req.body.ressortID
 * @param {number} req.params.id ID of member
 * @param res status code and message
 */
export const setTraineeAssignment = async (req: Request, res: Response): Promise<Response> => {
  const memberID = parseInt(req.params.id);
  const assignment = req.body as TraineeAssignment;

  await traineesService.updateAssignmentByMemberID(memberID, assignment);

  return res.status(200).send("Updated trainee assignment");
};

/**
 * Addes one new member as mentor to generation
 * @param {Request} req request object
 * @param {number} req.params.member_id ID of member
 * @param {number} req.params.id ID of generation
 * @param res status code and message
 */
export const addMentor = async (req: Request, res: Response): Promise<Response> => {
  const memberID = parseInt(req.params.member_id);
  const generationID = parseInt(req.params.id);

  await traineesService.addMentorToGeneration(generationID, memberID);

  return res.status(200).send("Added mentor");
};

/**
 * Gets memberID, first and last name of Mentors of generation
 * @param {Request} req request object
 * @param {number} req.params.id ID of generation
 * @param res status code and message
 */
export const getMentorsOfGeneration = async (req: Request, res: Response): Promise<Response> => {
  const generationID = parseInt(req.params.id);
  const mentors = await traineesService.getMentorsByGenerationID(generationID);

  return res.status(200).json(mentors);
};

/**
 * Gets information of internal projects of generation
 * @param {Request} req request object
 * @param {number} req.params.id ID of Generation
 * @param res ID, generation, name and short name
 */
export const getInternalProjectsOfGeneration = async (req: Request, res: Response): Promise<Response> => {
  const generationID = parseInt(req.params.id);
  const internalProjects = await traineesService.getInternalProjectsByGenerationID(generationID);

  return res.status(200).json(internalProjects);
};

/**
 * Checks if the given ids are present in the database
 * @param {Array<string>} ids ids that need to be checked
 * @param {Array<string>} idNames id's corresponding column names in database
 * @param {Array<string>} tables id's corresponding tabel names in database
 * @returns {Promise<{ state: number; errorMessage: string }>} status code and error message when an error was found. If no error occured return { state: 0, errorMessage: "success" }
 */
const checkForIDs = async (
  ids: Array<string>,
  idNames: Array<string>,
  tables: Array<string>
): Promise<{ state: number; errorMessage: string }> => {
  // Iterate over all inputs
  for (let index = 0; index < ids.length; index++) {
    // Check if given names vor table und colum contain any SQL keywords
    if (checkForSQLKeywords(tables[index]) || checkForSQLKeywords(idNames[index])) {
      throw Error("No SQL statements allowed in String!");
    }
    // Check if id is null or empty
    if (ids[index]) {
      // Query database to check if id exits
      const resultQuery = await database.query(
        `SELECT ${idNames[index]} FROM ${tables[index]} WHERE ${idNames[index]} = ?;`,
        [ids[index]]
      );
      if (!Array.isArray(resultQuery) || resultQuery.length === 0) {
        return { state: 404, errorMessage: `ID of ${idNames[index]} does not exist` };
      }
    } else {
      return { state: 422, errorMessage: `ID of ${idNames[index]} is null or empty` };
    }
  }
  return { state: 0, errorMessage: "success" };
};

/**
 * Retrieves all current trainees
 */
export const retrieveCurrentTrainees = async (req: Request, res: Response): Promise<Response> => {
  const trainees = await traineesService.getTrainees();

  return res.status(200).json(trainees);
};

/*
  Retrieves all current IPs
  */
export const retrieveCurrentIPs = async (req: Request, res: Response): Promise<Response> => {
  const ips = await traineesService.getInternalProjects(true);

  return res.status(200).json(ips);
};

/*
  Retrieve all IPs
*/
export const retrieveAllIPs = async (req: Request, res: Response): Promise<Response> => {
  const ips = await traineesService.getInternalProjects(false);

  return res.status(200).json(ips);
};

/*
  Retrieve milestones of internal project by generation
 */
export const retrieveIPMilestonesAndWorkshopFeedback = async (req: Request, res: Response): Promise<Response> => {
  const generationID = parseInt(req.params.id);
  const ips = await traineesService.getTraineeProgress(generationID);

  return res.status(200).json(ips);
};
