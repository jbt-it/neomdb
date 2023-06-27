/**
 * Definition of the handler functions for the members module
 */
import database = require("../database");
import bcrypt = require("bcryptjs");
import { PoolConnection } from "mysql";

import { Request, Response } from "express";
import * as traineesTypes from "./traineesTypes";

/**
 * Retrieves all current trainees
 */
export const retrieveCurrentTrainees = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT mitgliedID, vorname, nachname
        FROM mitglied
        WHERE mitgliedstatus = 1 AND mitglied.generation = (SELECT max(generation) from internesprojekt)
        ORDER BY nachname`,
      []
    )
    .then((result: traineesTypes.GetCurrentTraineesQueryResult[]) => {
      if (result.length === 0) {
        res.status(404).send("Trainees not found");
      } else {
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};

/*
  Retrieves all current IPs
  */
export const retrieveCurrentIPs = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT internesprojektID, projektname, kickoff, AngebotBeiEV, ZPbeiEV, APgehalten
      FROM internesprojekt
      WHERE generation = (SELECT max(generation) from internesprojekt)
      ORDER BY internesprojektID`,
      []
    )
    .then((result: traineesTypes.GetCurrentTraineesQueryResult[]) => {
      if (result.length === 0) {
        res.status(404).send("IPs not found");
      } else {
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};

/*
  Retrieve all IPs
*/
export const retrieveAllIPs = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT *
      FROM internesprojekt 
      ORDER BY generation`,
      []
    )
    .then((result: traineesTypes.GetAllIPsQueryResult[]) => {
        res.status(200).json(result); //IPs are unsorted
      }
    )
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};

/*
  Retrieve a list of all Trainees with their respective IPs
  Group all Trainees into their corresponding generations
*/
export const retrieveAllTraineesWithIPs = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT mitglied.generation, mitglied.mitgliedID, mitglied.vorname, mitglied.nachname, internesprojekt.internesprojektID, internesprojekt.projektname, internesprojekt.kuerzel, internesprojekt.kickoff, internesprojekt.AngebotBeiEV, internesprojekt.ZPbeiEV, internesprojekt.ZPgehalten, internesprojekt.APbeiEV, internesprojekt.APgehalten, internesprojekt.DLbeiEV
      FROM mitglied
      LEFT JOIN internesprojekt ON mitglied.generation = internesprojekt.generation 
      ORDER BY generation`,
      []
    )
    .then((result: traineesTypes.retrieveAllTraineesWithIPsQueryResult[]) => {
        let groupedGenerations = {};

        for (let i = 0; i < result.length; i++) {
          let obj = result[i];
          let generation = obj.generation;

          // Create Array for current generation if none exists yet
          if (!groupedGenerations[generation]) {
            groupedGenerations[generation] = [];
          }

          // Add object to respective generation
          groupedGenerations[generation].push(obj);
        }
        res.status(200).json(groupedGenerations);
      }
    )
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};
