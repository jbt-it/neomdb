/**
 * Definition of the handler functions for the members module
 */
import bcrypt = require("bcryptjs");
import { Request, Response } from "express";
import { PoolConnection } from "mysql2";
import { QueryResult } from "types/databaseTypes";
import { MemberDetails, UpdateDepartmentRequest } from "../../types/membersTypes";
import * as authTypes from "../../types/authTypes";
import { canPermissionBeDelegated, doesPermissionsInclude } from "../../utils/authUtils";
import { getRandomString } from "../../utils/stringUtils";
import database = require("../../database");
import MembersService from "./membersService";
import { UnauthorizedError } from "../../types/errors";
// TODO: Out comment if external account creation is activated
// import { createMailAccount, addMailAccountToMailingList } from "../utils/plesk";
// import { createMWUser } from "../utils/mediawiki";
// import { createNCUser } from "../utils/nextcloud";

const membersService = new MembersService();
/**
 * Retrieves an overview of all registered members
 */
export const retrieveMemberList = async (req: Request, res: Response): Promise<Response> => {
  const memberList = await membersService.getMemberList();
  return res.status(200).json(memberList);
};

/**
 * Retrieves a member specified by id
 * Returns financial data iff member has permission or is himself
 */
export const retrieveMemberDetails = async (req: Request, res: Response): Promise<Response> => {
  const memberID = Number(req.params.id);
  const permissions = res.locals.permissions;
  let userCanViewFinancialData = false;

  // Only if the user is the member to retrieve or they have the correct permissions
  // the financial data is retrieved as well
  if (memberID === res.locals.memberID || doesPermissionsInclude(permissions, [6])) {
    userCanViewFinancialData = true;
  }
  const memberDetailsDto: MemberDetails = await membersService.getMemberDetails(memberID, userCanViewFinancialData);
  return res.status(200).json(memberDetailsDto);
};

/**
 * Retrieves all members of a department (this does not invclude the director of a department)
 */
export const retrieveMembersOfDepartments = async (req: Request, res: Response): Promise<Response> => {
  const membersOfDepartments = await membersService.getMembersOfDepartments();

  return res.status(200).json(membersOfDepartments);
};

/**
 * Retrieves all current directors (if query parameter `current` is true) or all directors
 */
export const retrieveDirectors = async (req: Request, res: Response): Promise<Response> => {
  // Query parameter to specify if only the current directors should be retrieved
  const current = req.query.current === "true";
  const directors = await membersService.getDirectors(current);

  return res.status(200).json(directors);
};

/**
 * Creates a new member in the database and creates accounts
 * for the different systems (webmail, nextcloud, mediawiki)
 */
export const createMember = async (req: Request, res: Response) => {
  let jbtMail = "";
  // New user name if the name already exists
  let newUserName = "";
  if (req.body.name) {
    // Search for req.body.name to check if it already exists
    const resultFirstQuery = await database.query(`SELECT name FROM mitglied WHERE name = ?`, [req.body.name]);
    // Check if req.body.name already exists
    if (Array.isArray(resultFirstQuery) && resultFirstQuery.length === 0) {
      newUserName = req.body.name;
    }
    // Counter for the number of "duplicates" in the database
    let duplicateCounter = 1;
    // If name is already taken create name v.nachname1 (or v.nachname2 etc.)
    while (newUserName === "") {
      const result = await database.query(`SELECT name FROM mitglied WHERE name = ?`, [
        req.body.name + duplicateCounter,
      ]);
      // Check if the result is an array and if it's empty (this means, that the name does not already exist)
      if (Array.isArray(result) && result.length === 0) {
        newUserName = req.body.name + duplicateCounter;
      }
      duplicateCounter++;
    }
    jbtMail = `${newUserName}@studentische-beratung.de`;
  } else {
    res.status(500).send("Username not specified");
    return;
  }

  /**
   * Overview of the status of the different account creation operations
   */
  let statusOverview = {
    // Status of the query to create a member in the database
    queryStatus: "fail",

    // Error message if query failed
    queryErrorMsg: "",

    // Status of the mail api-call to create a mail account
    mailStatus: "fail",

    // Error message if mail account creation failed
    mailErrorMsg: "",

    // Status of the mail api-call to add the mail account to a mailing list
    mailListStatus: "fail",

    // Error message if mail account couldn't be added to the mailing list
    mailListErrorMsg: "",

    // Status of the nextcloud api-call to create a nextcloud account
    nextcloudStatus: "fail",

    // Error message if nextcloud account creation failed
    nextcloudErrorMsg: "",

    // Status of the mediawiki api-call to create a mediawiki account
    wikiStatus: "fail",

    // Error message if wiki account creation failed
    wikiErrorMsg: "",
  };

  bcrypt
    .hash(req.body.password, 12)
    .then((hash) => {
      database
        .query(
          `INSERT INTO mitglied (vorname, nachname, geburtsdatum, handy, name, geschlecht, passwordHash, icalToken, mitgliedstatus, generation, trainee_seit, email2, jbt_email, ressort)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            req.body.vorname,
            req.body.nachname,
            req.body.geburtsdatum,
            req.body.handy,
            newUserName,
            req.body.geschlecht,
            hash,
            getRandomString(16),
            1, // Status of member is at default "trainee"
            req.body.generation,
            req.body.traineeSeit,
            req.body.email,
            jbtMail,
            8, // Department is at default "Ohne Ressort"
          ]
        )
        .then(() => {
          // Set the status of the query
          statusOverview = { ...statusOverview, queryStatus: "success" };

          // TODO: Commented out for the time beeing
          // createMailAccount(jbtMail, hash)
          //   .then((mailResult: membersTypes.PleskApiResult) => {
          //     if (mailResult.code === 0) {
          //       // Set the status of the mail
          //       statusOverview = { ...statusOverview, mailStatus: "success" };
          //     } else {
          //       // Set the error message of the mail
          //       statusOverview = {
          //         ...statusOverview,
          //         mailErrorMsg: mailResult.stderr,
          //       };
          //       res.status(500).json(statusOverview);
          //       return;
          //     }
          //     addMailAccountToMailingList("trainee", jbtMail)
          //       .then((mailListRes: membersTypes.PleskApiResult) => {
          //         if (mailListRes.code === 0) {
          //           // Set the status of the mailing list
          //           statusOverview = {
          //             ...statusOverview,
          //             mailListStatus: "success",
          //           };
          //         } else {
          //           // Set the error message of the mailing list
          //           statusOverview = {
          //             ...statusOverview,
          //             mailErrorMsg: mailListRes.stderr,
          //           };
          //           return;
          //         }
          //         createNCUser(req.body.name, req.body.name, "", jbtMail, ["Mitglied"])
          //           .then((ncResult: membersTypes.NCApiResult) => {
          //             if (ncResult.statuscode === 100) {
          //               // Set the status of the nextcloud
          //               statusOverview = {
          //                 ...statusOverview,
          //                 nextcloudStatus: "success",
          //               };
          //             } else {
          //               statusOverview = {
          //                 ...statusOverview,
          //                 nextcloudErrorMsg: ncResult.message,
          //               };
          //             }

          //             createMWUser(req.body.name, hash, jbtMail)
          //               .then((mwResult: membersTypes.MWApiResult) => {
          //                 if (mwResult.status === "PASS") {
          //                   // Set the status of the mediawiki
          //                   statusOverview = {
          //                     ...statusOverview,
          //                     wikiStatus: "success",
          //                   };
          database
            .query("SELECT name, mitgliedID, jbt_email FROM mitglied WHERE name = ?", [newUserName])
            .then(
              (
                result: QueryResult
                // membersTypes.GetMemberIdentificationQueryResult[]
              ) => {
                if (result.length === 0) {
                  res.status(500).send(`Error creating member with name: ${newUserName}`);
                  return;
                }
                res.status(201).json({ statusOverview, newUser: result[0] });
              }
            )
            .catch(() => {
              res.status(500).send(`Error creating member with name: ${newUserName}`);
            });
          //                 } else {
          //                   statusOverview = {
          //                     ...statusOverview,
          //                     wikiErrorMsg: mwResult.message,
          //                   };
          //                   res.status(500).json(statusOverview);
          //                 }
          //               })
          //               .catch((mwErr) => {
          //                 statusOverview = {
          //                   ...statusOverview,
          //                   wikiErrorMsg: mwErr,
          //                 };
          //                 res.status(500).json(statusOverview);
          //               });
          //           })
          //           .catch((ncErr) => {
          //             statusOverview = {
          //               ...statusOverview,
          //               nextcloudErrorMsg: ncErr,
          //             };
          //             createMWUser(req.body.name, hash, jbtMail)
          //               .then((mwResult: membersTypes.MWApiResult) => {
          //                 if (mwResult.status === "PASS") {
          //                   // Set the status of the mediawiki
          //                   statusOverview = {
          //                     ...statusOverview,
          //                     wikiStatus: "success",
          //                   };
          //                 } else {
          //                   statusOverview = {
          //                     ...statusOverview,
          //                     wikiErrorMsg: mwResult.message,
          //                   };
          //                 }
          //                 res.status(500).json(statusOverview);
          //               })
          //               .catch((err) => {
          //                 statusOverview = {
          //                   ...statusOverview,
          //                   wikiErrorMsg: err,
          //                 };
          //                 res.status(500).json(statusOverview);
          //               });
          //           });
          //       })
          //       .catch((err) => {
          //         // Set the error message of the mailing list
          //         statusOverview = {
          //           ...statusOverview,
          //           mailListErrorMsg: err,
          //         };
          //         createNCUser(req.body.name, req.body.name, "", jbtMail, ["Mitglied"])
          //           .then((ncResult: membersTypes.NCApiResult) => {
          //             if (ncResult.statuscode === 100) {
          //               // Set the status of the nextcloud
          //               statusOverview = {
          //                 ...statusOverview,
          //                 nextcloudStatus: "success",
          //               };
          //             } else {
          //               statusOverview = {
          //                 ...statusOverview,
          //                 nextcloudErrorMsg: ncResult.message,
          //               };
          //             }

          //             createMWUser(req.body.name, hash, jbtMail)
          //               .then((mwResult: membersTypes.MWApiResult) => {
          //                 if (mwResult.status === "PASS") {
          //                   // Set the status of the mediawiki
          //                   statusOverview = {
          //                     ...statusOverview,
          //                     wikiStatus: "success",
          //                   };
          //                   res.status(201).json(statusOverview);
          //                 } else {
          //                   statusOverview = {
          //                     ...statusOverview,
          //                     wikiErrorMsg: mwResult.message,
          //                   };
          //                   res.status(500).json(statusOverview);
          //                 }
          //               })
          //               .catch((mwErr) => {
          //                 statusOverview = {
          //                   ...statusOverview,
          //                   wikiErrorMsg: mwErr,
          //                 };
          //                 res.status(500).json(statusOverview);
          //               });
          //           })
          //           .catch((ncErr) => {
          //             statusOverview = {
          //               ...statusOverview,
          //               nextcloudErrorMsg: ncErr,
          //             };
          //             createMWUser(req.body.name, hash, jbtMail)
          //               .then((mwResult: membersTypes.MWApiResult) => {
          //                 if (mwResult.status === "PASS") {
          //                   // Set the status of the mediawiki
          //                   statusOverview = {
          //                     ...statusOverview,
          //                     wikiStatus: "success",
          //                   };
          //                 } else {
          //                   statusOverview = {
          //                     ...statusOverview,
          //                     wikiErrorMsg: mwResult.message,
          //                   };
          //                 }
          //                 res.status(500).json(statusOverview);
          //               })
          //               .catch((mwErr) => {
          //                 statusOverview = {
          //                   ...statusOverview,
          //                   wikiErrorMsg: mwErr,
          //                 };
          //                 res.status(500).json(statusOverview);
          //               });
          //           });
          //       });
          //   })
          //   .catch((err) => {
          //     // Set the error message of the webmail
          //     statusOverview = {
          //       ...statusOverview,
          //       mailErrorMsg: err,
          //     };
          //     res.status(500).json(statusOverview);
          //   });
        })
        .catch((err) => {
          statusOverview = {
            ...statusOverview,
            queryErrorMsg: err.sqlMessage,
          };
          res.status(500).json(statusOverview);
        });
    })
    .catch((err) => {
      statusOverview = {
        ...statusOverview,
        queryErrorMsg: err,
      };
      res.status(500).json(statusOverview);
    });
};

/**
 * Retrieves the departments
 */
export const retrieveDepartments = async (req: Request, res: Response): Promise<Response> => {
  const departments = await membersService.getDepartments();

  return res.status(200).json(departments);
};

/**
 * Updates the department infos with the given id
 */
export const updateDepartmentInfo = async (req: Request, res: Response): Promise<Response> => {
  const departmentID = Number(req.params.id);
  const updateDepartmentRequest = req.body as UpdateDepartmentRequest;
  await membersService.updateDepartment(departmentID, updateDepartmentRequest);

  return res.status(200).send("Department updated");
};

/**
 * Retrieves the language values
 */
export const retrieveLanguages = async (req: Request, res: Response): Promise<Response> => {
  const languages = await membersService.getLanguageValues();

  return res.status(200).json(languages);
};

/**
 * Retrieves the edv skills
 */
export const retrieveEDVSkills = async (req: Request, res: Response): Promise<Response> => {
  const edvSkills = await membersService.getEdvSkillValues();

  return res.status(200).json(edvSkills);
};

/**
 * Updates the information of an existing member
 * Update of critical fields can be done by member with certain permission
 * Update of critical and non critical fields can be done by member himself with additional permission
 */
export const updateMemberDetails = async (req: Request, res: Response): Promise<Response> => {
  const memberID = Number(req.params.id);
  const { mentor, sprachen: languages, edvkenntnisse: edvSkills, ...member } = req.body as MemberDetails;

  // Grants access to all fields if member is himself and has additional permission
  if (memberID === res.locals.memberID && doesPermissionsInclude(res.locals.permissions, [1])) {
    await membersService.updateMemberDetails(memberID, member, mentor, languages, edvSkills, true, true);
    return res.status(200).send("Member updated");
  }

  // Grants access to non critical fields to the member himself
  if (memberID === res.locals.memberID) {
    await membersService.updateMemberDetails(memberID, member, mentor, languages, edvSkills, false, true);
    return res.status(200).send("Member updated");
  }

  // Grants access to critical fields for members with permission
  if (doesPermissionsInclude(res.locals.permissions, [1])) {
    await membersService.updateMemberDetails(memberID, member, mentor, languages, edvSkills, true, false);
    return res.status(200).send("Member updated");
  }

  // If none of the above is true, the member is not allowed to update the member
  return res.status(403).send("Authorization failed: You are not permitted to do this");
};

/**
 * Change member status to left association (ausgetreten)
 */
export const deleteMember = (req: Request, res: Response): void => {
  // Checks if the member is allowed to delete the permission

  database
    .query("UPDATE mitglied SET mitgliedstatus=6 WHERE mitgliedID=?", [req.params.id])
    .then((result) => {
      res.status(200).send("Member status set to left association");
    })
    .catch((err) => {
      res.status(500).send("Database Error: Changing member status failed");
    });
};

/**
 * Retrieves all directors and members permission assignments
 */
export const retrievePermissionAssignments = async (req: Request, res: Response): Promise<Response> => {
  const permissionAssignments = await membersService.getPermissionAssignments();

  return res.status(200).json(permissionAssignments);
};

/**
 * Retrieves name, description and ID of all permissions
 */
export const retrievePermissions = async (req: Request, res: Response): Promise<Response> => {
  const permissions = await membersService.getPermissions();

  return res.status(200).json(permissions);
};

/**
 * Retrieves a list of all permissions of the member with the given ID
 */
export const retrievePermissionsByMemberId = async (req: Request, res: Response): Promise<Response> => {
  const memberID = Number(req.params.id);
  const permissions = await membersService.getPermissionsByMemberID(memberID);

  return res.status(200).json(permissions);
};

/**
 * Create new permission
 */
export const assignPermissionToMember = async (req: Request, res: Response): Promise<Response> => {
  const { memberID, permissionID } = req.body;

  // Checks if the member is allowed to delegate the permission
  if (
    !doesPermissionsInclude(res.locals.permissions, [permissionID]) ||
    !canPermissionBeDelegated(res.locals.permissions, permissionID)
  ) {
    throw new UnauthorizedError("Permission cannot be delegated!");
  }

  await membersService.addPermissionToMember(memberID, permissionID);

  return res.status(201).send({
    message: "Permission created",
    mitgliedID: req.body.memberID,
    berechtigungID: req.body.permissionID,
  });
};

/**
 * Delete issued permission from member
 */
export const unassignPermissionFromMember = async (req: Request, res: Response): Promise<Response> => {
  const { memberID, permissionID } = req.body;
  // Checks if the member is allowed to delete the permission
  if (
    !doesPermissionsInclude(res.locals.permissions, [permissionID]) ||
    !canPermissionBeDelegated(res.locals.permissions, permissionID)
  ) {
    throw new UnauthorizedError("Permission cannot be deleted!");
  }

  await membersService.deletePermissionFromMember(memberID, permissionID);
  return res.status(200).send("Permission deleted");
};
