/**
 * Definition of the handler functions for the members module
 */
 import database = require("../database");
 import bcrypt = require("bcryptjs");
 import { PoolConnection } from "mysql";
 
 import { Request, Response } from "express";
 import * as traineesTypes from "./traineesTypes";
 

/**
 * Retrieves all trainees
 */
export const retrieveCurrentTrainees = (req: Request, res: Response): void => {
    database.query(
      `SELECT mitgliedID, vorname, nachname
        FROM mitglied
        WHERE mitgliedstatus = 1 AND mitglied.generation = (SELECT max(generation) from internesprojekt)
        ORDER BY nachname`, [])
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

  /**
 * Retrieves all current IPs
 */
export const retrieveCurrentIPs = (req: Request, res: Response): void => {
  database.query(
    `SELECT internesprojektID, projektname, kickoff, AngebotBeiEV, ZPbeiEV, APgehalten
      FROM internesprojekt
      WHERE generation = (SELECT max(generation) from internesprojekt)
      ORDER BY internesprojektID`, [])
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



  /**
 * Retrieves all trainee generations
 * SELECT MAX(generationID) FROM generation; 
 * For all i to Max(generationID) create type?
 */
export const retrieveTraineeGenerations = (req: Request, res: Response): void => {
    //numberOfGenerations = database.query(SELECT MAX(generationID) FROM generation)
    
    let numberOfGenerations: number;
    database.query('SELECT MAX(generationID) FROM generation',[]).then((result: number)=>{
        numberOfGenerations = result;
    });
 
    for (var i = 1; i< numberOfGenerations + 1;i++){
        database.query(
            `SELECT mitgliedID, vorname, nachname
              FROM mitglied
              WHERE generationID =` +i+

              //hier noch Projekte

              `ORDER BY nachname`, [])
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
  };