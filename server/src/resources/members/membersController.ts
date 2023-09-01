/**
 * Definition of the handler functions for the members module
 */
import bcrypt = require("bcryptjs");
import { Request, Response } from "express";
import { PoolConnection } from "mysql2";
import { QueryResult } from "types/databaseTypes";
import {
  CreateMemberRequest,
  CreateMemberResponse,
  MemberDetails,
  StatusOverview,
  UpdateDepartmentRequest,
} from "../../types/membersTypes";
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
export const createMember = async (req: Request, res: Response): Promise<Response> => {
  /**
   * Overview of the status of the different account creation operations
   */
  const statusOverview: StatusOverview = {
    // Status of the query to create a member in the database
    querySuccesful: false,

    // Error message if query failed
    queryErrorMsg: "",

    // Status of the mail api-call to create a mail account
    mailSuccesful: false,

    // Error message if mail account creation failed
    mailErrorMsg: "",

    // Status of the mail api-call to add the mail account to a mailing list
    mailListSuccesful: false,

    // Error message if mail account couldn't be added to the mailing list
    mailListErrorMsg: "",

    // Status of the nextcloud api-call to create a nextcloud account
    nextcloudSuccesful: false,

    // Error message if nextcloud account creation failed
    nextcloudErrorMsg: "",

    // Status of the mediawiki api-call to create a mediawiki account
    wikiSuccesful: false,

    // Error message if wiki account creation failed
    wikiErrorMsg: "",
  };

  const newMember = req.body as CreateMemberRequest;
  const createMemberResponse: CreateMemberResponse = await membersService.createAccountsOfMember(
    newMember,
    statusOverview
  );

  if (!createMemberResponse.statusOverview.querySuccesful) {
    return res.status(500).json(createMemberResponse);
  }
  return res.status(201).json(createMemberResponse);
};

/**
 * Updates the status of an existing member
 * Update can be done by members with certain permission
 * Update can be done by member himself with an additional permission
 */
export const updateMemberStatus = (req: Request, res: Response): void => {
  const date: Date = new Date();

  // Format date yyyy-mm-dd hh:mm:ss
  const lastChangeTime =
    date.getFullYear() +
    "-" +
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + date.getDate()).slice(-2) +
    " " +
    ("00" + date.getHours()).slice(-2) +
    ":" +
    ("00" + date.getMinutes()).slice(-2) +
    ":" +
    ("00" + date.getSeconds()).slice(-2);

  // Get status that was changed
  // Trainee, aktives Mitglied, Senior, Alumnus, passives Mitglied, ausgetretenes Mitglied
  let statusChangeDate = "";
  switch (req.body.mitgliedstatus) {
    case "Trainee":
      statusChangeDate = "trainee_seit = ? ";
      break;
    case "aktives Mitglied":
      statusChangeDate = "aktiv_seit = ? ";
      break;
    case "Senior":
      statusChangeDate = "senior_seit = ? ";
      break;
    case "Alumnus":
      statusChangeDate = "alumnus_seit = ? ";
      break;
    case "passives Mitglied":
      statusChangeDate = "passiv_seit = ? ";
      break;
    case "Ausgetretene":
      statusChangeDate = "ausgetreten_seit = ? ";
      break;
    default:
      break;
  }

  database
    .query(
      `UPDATE mitglied
        SET mitgliedstatus = (SELECT mitgliedstatusID FROM mitgliedstatus WHERE bezeichnung = ?), lastchange = ?, ` +
        statusChangeDate +
        `WHERE mitgliedID = ?`,
      [req.body.mitgliedstatus, lastChangeTime, lastChangeTime, req.params.id]
    )
    .then((result) => {
      res.status(200).send("Profile Update Successful");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Query Error: Updating Profile failed");
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