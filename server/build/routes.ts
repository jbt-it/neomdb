/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse, fetchMiddlewares } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../src/auth/authController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MembersController } from './../src/resources/members/membersController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TraineesController } from './../src/resources/trainees/traineesController';
import { expressAuthentication } from './../src/middleware/authentication';
// @ts-ignore - no great way to install types from subpackage
const promiseAny = require('promise.any');
import type { RequestHandler, Router } from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "Permission": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"directorID":{"dataType":"double"},"canDelegate":{"dataType":"boolean","required":true},"permissionID":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JWTPayload": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"roles":{"dataType":"array","array":{"dataType":"double"},"required":true},"permissions":{"dataType":"array","array":{"dataType":"refAlias","ref":"Permission"},"required":true},"name":{"dataType":"string","required":true},"mitgliedID":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserLoginRequest": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"password":{"dataType":"string","required":true},"username":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserChangePasswordRequest": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"newPassword":{"dataType":"string","required":true},"oldPassword":{"dataType":"string","required":true},"userName":{"dataType":"string","required":true},"userID":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserForgotPasswordRequest": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"email":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserResetPasswordRequest": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"newPassword":{"dataType":"string","required":true},"key":{"dataType":"string","required":true},"email":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MemberStatus": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["Trainee"]},{"dataType":"enum","enums":["aktives Mitglied"]},{"dataType":"enum","enums":["Senior"]},{"dataType":"enum","enums":["Alumnus"]},{"dataType":"enum","enums":["passives Mitglied"]},{"dataType":"enum","enums":["Ausgetretene"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MemberPartial": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"lastchange":{"dataType":"string","required":true},"ressort":{"dataType":"string","required":true},"mitgliedstatus":{"ref":"MemberStatus","required":true},"jbt_email":{"dataType":"string","required":true},"handy":{"dataType":"double","required":true},"nachname":{"dataType":"string","required":true},"vorname":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MemberImage": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"mimeType":{"dataType":"string","required":true},"base64":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DepartmentMember": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"bezeichnung":{"dataType":"string","required":true},"ressort":{"dataType":"string","required":true},"nachname":{"dataType":"string","required":true},"vorname":{"dataType":"string","required":true},"mitgliedID":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Director": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"kuerzel":{"dataType":"string","required":true},"bezeichnung_maennlich":{"dataType":"string","required":true},"bezeichnung_weiblich":{"dataType":"string","required":true},"geschlecht":{"dataType":"string","required":true},"ressortID":{"dataType":"double","required":true},"evpostenID":{"dataType":"double","required":true},"nachname":{"dataType":"string","required":true},"vorname":{"dataType":"string","required":true},"mitgliedID":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StatusOverview": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"wikiErrorMsg":{"dataType":"string","required":true},"wikiSuccesful":{"dataType":"boolean","required":true},"nextcloudErrorMsg":{"dataType":"string","required":true},"nextcloudSuccesful":{"dataType":"boolean","required":true},"mailListErrorMsg":{"dataType":"string","required":true},"mailListSuccesful":{"dataType":"boolean","required":true},"mailErrorMsg":{"dataType":"string","required":true},"mailSuccesful":{"dataType":"boolean","required":true},"queryErrorMsg":{"dataType":"string","required":true},"querySuccesful":{"dataType":"boolean","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateMemberResponse": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"statusOverview":{"ref":"StatusOverview","required":true},"memberID":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateMemberRequest": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"traineeSeit":{"dataType":"string","required":true},"password":{"dataType":"string","required":true},"generation":{"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},"geschlecht":{"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},"handy":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"geburtsdatum":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"email":{"dataType":"string","required":true},"name":{"dataType":"string","required":true},"nachname":{"dataType":"string","required":true},"vorname":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Department": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"linkOrganigramm":{"dataType":"string","required":true},"linkZielvorstellung":{"dataType":"string","required":true},"jbt_email":{"dataType":"string","required":true},"kuerzel":{"dataType":"string","required":true},"bezeichnung":{"dataType":"string","required":true},"ressortID":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateDepartmentRequest": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"linkOrganigramm":{"dataType":"string","required":true},"linkZielvorstellung":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Value": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"wert":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PermissionAssignment": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"canDelegate":{"dataType":"boolean","required":true},"permissionID":{"dataType":"double","required":true},"mitgliedID":{"dataType":"double","required":true},"name":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AssignPermissionToMemberRequest": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"permissionID":{"dataType":"double","required":true},"memberID":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Language": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"niveau":{"dataType":"double","required":true},"wert":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EdvSkill": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"niveau":{"dataType":"double","required":true},"wert":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Mentee": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"nachname":{"dataType":"string","required":true},"vorname":{"dataType":"string","required":true},"mitgliedID":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Mentor": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"generationID":{"dataType":"double"},"nachname":{"dataType":"string"},"vorname":{"dataType":"string"},"mitgliedID":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MemberDetails": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"mentor":{"dataType":"union","subSchemas":[{"ref":"Mentor"},{"dataType":"enum","enums":[null]}]},"mentees":{"dataType":"array","array":{"dataType":"refAlias","ref":"Mentee"}},"edvkenntnisse":{"dataType":"array","array":{"dataType":"refAlias","ref":"EdvSkill"}},"sprachen":{"dataType":"array","array":{"dataType":"refAlias","ref":"Language"}},"bic":{"dataType":"string"},"iban":{"dataType":"string"},"kontoinhaber":{"dataType":"string"},"ersthelferausbildung":{"dataType":"boolean","required":true},"fuehrerschein":{"dataType":"boolean","required":true},"lastchange":{"dataType":"string","required":true},"canQM":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"canPL":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"engagement":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"ausbildung":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"vertiefungen":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"studienende":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"studienbeginn":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"studiengang":{"dataType":"string","required":true},"hochschule":{"dataType":"string","required":true},"email2":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"tel2":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"ort2":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"plz2":{"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},"strasse2":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"email1":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"tel1":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"ort1":{"dataType":"string","required":true},"plz1":{"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},"strasse1":{"dataType":"string","required":true},"arbeitgeber":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"ressort":{"dataType":"string","required":true},"ausgetreten_seit":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"passiv_seit":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"aktiv_seit":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"senior_seit":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"alumnus_seit":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"mitglied_seit":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"trainee_seit":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"internesprojekt":{"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},"generation":{"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},"mitgliedstatus":{"ref":"MemberStatus","required":true},"jbt_email":{"dataType":"string","required":true},"handy":{"dataType":"string","required":true},"geburtsdatum":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"geschlecht":{"dataType":"double","required":true},"vorname":{"dataType":"string","required":true},"nachname":{"dataType":"string","required":true},"mitgliedID":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Trainee": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"generation":{"dataType":"double","required":true},"nachname":{"dataType":"string","required":true},"vorname":{"dataType":"string","required":true},"mitgliedID":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InternalProject": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"DLBeiEV":{"dataType":"boolean","required":true},"APGehalten":{"dataType":"string","required":true},"APBeiEV":{"dataType":"boolean","required":true},"ZPGehalten":{"dataType":"string","required":true},"ZPBeiEV":{"dataType":"boolean","required":true},"AngebotBeiEV":{"dataType":"boolean","required":true},"kickoff":{"dataType":"string","required":true},"kuerzel":{"dataType":"string","required":true},"projektname":{"dataType":"string","required":true},"generation":{"dataType":"double","required":true},"internesProjektID":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TraineeChoice": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"wahl_ressort3":{"dataType":"double","required":true},"wahl_ressort2":{"dataType":"double","required":true},"wahl_ressort1":{"dataType":"double","required":true},"wahl_ressort":{"dataType":"double","required":true},"wahl_internesprojekt3":{"dataType":"double","required":true},"wahl_internesprojekt2":{"dataType":"double","required":true},"wahl_internesprojekt1":{"dataType":"double","required":true},"wahl_internesprojekt":{"dataType":"double","required":true},"wahl_mentor3":{"dataType":"double","required":true},"wahl_mentor2":{"dataType":"double","required":true},"wahl_mentor1":{"dataType":"double","required":true},"wahl_mentor":{"dataType":"double","required":true},"nachname":{"dataType":"string","required":true},"vorname":{"dataType":"string","required":true},"mitgliedID":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JBTMail": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"email":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Generation": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"wahl_ende":{"dataType":"datetime","required":true},"wahl_start":{"dataType":"datetime","required":true},"tuercode":{"dataType":"double","required":true},"infoabendBesucher":{"dataType":"double","required":true},"auswahlWETermin":{"dataType":"string","required":true},"wwTermin":{"dataType":"string","required":true},"bewerbung_ende":{"dataType":"datetime","required":true},"bewerbung_start":{"dataType":"datetime","required":true},"bezeichnung":{"dataType":"string","required":true},"generationID":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TraineeMotivation": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"wahl_internesprojekt3_motivation":{"dataType":"string","required":true},"wahl_internesprojekt2_motivation":{"dataType":"string","required":true},"wahl_internesprojekt1_motivation":{"dataType":"string","required":true},"mitgliedID":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateVotingDeadlinesRequest": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"votingEnd":{"dataType":"string","required":true},"votingStart":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TraineeAssignment": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"departmentID":{"dataType":"double","required":true},"mentorID":{"dataType":"double","required":true},"ipID":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InternalProjectAndTrainee": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"DLbeiEV":{"dataType":"boolean","required":true},"APgehalten":{"dataType":"string","required":true},"APbeiEV":{"dataType":"boolean","required":true},"ZPgehalten":{"dataType":"string","required":true},"ZPbeiEV":{"dataType":"boolean","required":true},"AngebotBeiEV":{"dataType":"boolean","required":true},"kuerzel":{"dataType":"string","required":true},"projektname":{"dataType":"string","required":true},"internesprojekt":{"dataType":"double","required":true},"generation":{"dataType":"double","required":true},"nachname":{"dataType":"string","required":true},"vorname":{"dataType":"string","required":true},"mitgliedID":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Workshop": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"feedbackAbgegeben":{"dataType":"double","required":true},"schulungsname":{"dataType":"string","required":true},"schulungsinstanzID":{"dataType":"double","required":true},"mitgliedID":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TraineeProgress": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"InternalProjectAndTrainee"},{"ref":"Workshop"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.post('/api/auth/login',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.login)),

            function AuthController_login(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UserLoginRequest"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AuthController();


              const promise = controller.login.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/auth/me',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.getUserData)),

            function AuthController_getUserData(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AuthController();


              const promise = controller.getUserData.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/api/auth/change-password',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.changePassword)),

            function AuthController_changePassword(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UserChangePasswordRequest"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AuthController();


              const promise = controller.changePassword.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/auth/forgot-password',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.sendPasswordResetLink)),

            function AuthController_sendPasswordResetLink(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UserForgotPasswordRequest"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AuthController();


              const promise = controller.sendPasswordResetLink.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/api/auth/reset-forgot-password',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.resetPasswordWithKey)),

            function AuthController_resetPasswordWithKey(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UserResetPasswordRequest"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AuthController();


              const promise = controller.resetPasswordWithKey.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/auth/logout',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.logout)),

            function AuthController_logout(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AuthController();


              const promise = controller.logout.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/members',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MembersController)),
            ...(fetchMiddlewares<RequestHandler>(MembersController.prototype.getMembers)),

            function MembersController_getMembers(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MembersController();


              const promise = controller.getMembers.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/members/:id/image',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MembersController)),
            ...(fetchMiddlewares<RequestHandler>(MembersController.prototype.getMemberImage)),

            function MembersController_getMemberImage(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MembersController();


              const promise = controller.getMemberImage.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/members/:id/image',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MembersController)),
            ...(fetchMiddlewares<RequestHandler>(MembersController.prototype.saveImage)),

            function MembersController_saveImage(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"MemberImage"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MembersController();


              const promise = controller.saveImage.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/members/department-members',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MembersController)),
            ...(fetchMiddlewares<RequestHandler>(MembersController.prototype.getMembersOfDepartments)),

            function MembersController_getMembersOfDepartments(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MembersController();


              const promise = controller.getMembersOfDepartments.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/members/directors',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MembersController)),
            ...(fetchMiddlewares<RequestHandler>(MembersController.prototype.getDirectors)),

            function MembersController_getDirectors(request: any, response: any, next: any) {
            const args = {
                    current: {"in":"query","name":"current","required":true,"dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MembersController();


              const promise = controller.getDirectors.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/members',
            authenticateMiddleware([{"jwt":["1"]}]),
            ...(fetchMiddlewares<RequestHandler>(MembersController)),
            ...(fetchMiddlewares<RequestHandler>(MembersController.prototype.createMember)),

            function MembersController_createMember(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"CreateMemberRequest"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MembersController();


              const promise = controller.createMember.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/api/members/:id/status',
            authenticateMiddleware([{"jwt":["1"]}]),
            ...(fetchMiddlewares<RequestHandler>(MembersController)),
            ...(fetchMiddlewares<RequestHandler>(MembersController.prototype.updateMemberStatus)),

            function MembersController_updateMemberStatus(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"mitgliedstatus":{"ref":"MemberStatus","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MembersController();


              const promise = controller.updateMemberStatus.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/members/departments',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MembersController)),
            ...(fetchMiddlewares<RequestHandler>(MembersController.prototype.getDepartments)),

            function MembersController_getDepartments(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MembersController();


              const promise = controller.getDepartments.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/api/members/departments/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MembersController)),
            ...(fetchMiddlewares<RequestHandler>(MembersController.prototype.updateDepartment)),

            function MembersController_updateDepartment(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UpdateDepartmentRequest"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MembersController();


              const promise = controller.updateDepartment.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/members/languages',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MembersController)),
            ...(fetchMiddlewares<RequestHandler>(MembersController.prototype.getLanguages)),

            function MembersController_getLanguages(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MembersController();


              const promise = controller.getLanguages.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/members/edv-skills',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MembersController)),
            ...(fetchMiddlewares<RequestHandler>(MembersController.prototype.getEDVSkills)),

            function MembersController_getEDVSkills(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MembersController();


              const promise = controller.getEDVSkills.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/members/permission-assignments',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MembersController)),
            ...(fetchMiddlewares<RequestHandler>(MembersController.prototype.getPermissionAssignments)),

            function MembersController_getPermissionAssignments(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MembersController();


              const promise = controller.getPermissionAssignments.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/members/permissions',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MembersController)),
            ...(fetchMiddlewares<RequestHandler>(MembersController.prototype.getPermissions)),

            function MembersController_getPermissions(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MembersController();


              const promise = controller.getPermissions.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/members/:id/permissions',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MembersController)),
            ...(fetchMiddlewares<RequestHandler>(MembersController.prototype.getPermissionsByMemberID)),

            function MembersController_getPermissionsByMemberID(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MembersController();


              const promise = controller.getPermissionsByMemberID.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/members/permissions',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MembersController)),
            ...(fetchMiddlewares<RequestHandler>(MembersController.prototype.assignPermissionToMember)),

            function MembersController_assignPermissionToMember(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"AssignPermissionToMemberRequest"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MembersController();


              const promise = controller.assignPermissionToMember.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/api/members/permissions',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MembersController)),
            ...(fetchMiddlewares<RequestHandler>(MembersController.prototype.unassignPermissionFromMember)),

            function MembersController_unassignPermissionFromMember(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"AssignPermissionToMemberRequest"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MembersController();


              const promise = controller.unassignPermissionFromMember.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/members/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MembersController)),
            ...(fetchMiddlewares<RequestHandler>(MembersController.prototype.getMember)),

            function MembersController_getMember(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MembersController();


              const promise = controller.getMember.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/api/members/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MembersController)),
            ...(fetchMiddlewares<RequestHandler>(MembersController.prototype.updateMember)),

            function MembersController_updateMember(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"MemberDetails"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MembersController();


              const promise = controller.updateMember.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/trainees',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TraineesController)),
            ...(fetchMiddlewares<RequestHandler>(TraineesController.prototype.getTrainees)),

            function TraineesController_getTrainees(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TraineesController();


              const promise = controller.getTrainees.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/trainees/ip/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TraineesController)),
            ...(fetchMiddlewares<RequestHandler>(TraineesController.prototype.getIP)),

            function TraineesController_getIP(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TraineesController();


              const promise = controller.getIP.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/trainees/generations/:id/trainee-choices',
            authenticateMiddleware([{"jwt":["14"]}]),
            ...(fetchMiddlewares<RequestHandler>(TraineesController)),
            ...(fetchMiddlewares<RequestHandler>(TraineesController.prototype.getTraineeChoicesOfGeneration)),

            function TraineesController_getTraineeChoicesOfGeneration(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TraineesController();


              const promise = controller.getTraineeChoicesOfGeneration.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/api/trainees/ip/:id',
            authenticateMiddleware([{"jwt":["15"]}]),
            ...(fetchMiddlewares<RequestHandler>(TraineesController)),
            ...(fetchMiddlewares<RequestHandler>(TraineesController.prototype.updateIP)),

            function TraineesController_updateIP(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"InternalProject"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TraineesController();


              const promise = controller.updateIP.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/trainees/ip/:id/mails',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TraineesController)),
            ...(fetchMiddlewares<RequestHandler>(TraineesController.prototype.getIPTeamMails)),

            function TraineesController_getIPTeamMails(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TraineesController();


              const promise = controller.getIPTeamMails.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/trainees/generations',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TraineesController)),
            ...(fetchMiddlewares<RequestHandler>(TraineesController.prototype.getGenerations)),

            function TraineesController_getGenerations(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TraineesController();


              const promise = controller.getGenerations.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/trainees/generations/:id/motivation',
            authenticateMiddleware([{"jwt":["14"]}]),
            ...(fetchMiddlewares<RequestHandler>(TraineesController)),
            ...(fetchMiddlewares<RequestHandler>(TraineesController.prototype.getTraineeMotivation)),

            function TraineesController_getTraineeMotivation(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TraineesController();


              const promise = controller.getTraineeMotivation.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/trainees/generations/:id/set-deadline',
            authenticateMiddleware([{"jwt":["14"]}]),
            ...(fetchMiddlewares<RequestHandler>(TraineesController)),
            ...(fetchMiddlewares<RequestHandler>(TraineesController.prototype.setVotingDeadline)),

            function TraineesController_setVotingDeadline(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UpdateVotingDeadlinesRequest"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TraineesController();


              const promise = controller.setVotingDeadline.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/api/trainees/:id/assignment',
            authenticateMiddleware([{"jwt":["14"]}]),
            ...(fetchMiddlewares<RequestHandler>(TraineesController)),
            ...(fetchMiddlewares<RequestHandler>(TraineesController.prototype.setTraineeAssignment)),

            function TraineesController_setTraineeAssignment(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"TraineeAssignment"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TraineesController();


              const promise = controller.setTraineeAssignment.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/trainees/generations/:id/mentors',
            authenticateMiddleware([{"jwt":["14"]}]),
            ...(fetchMiddlewares<RequestHandler>(TraineesController)),
            ...(fetchMiddlewares<RequestHandler>(TraineesController.prototype.getMentorsOfGeneration)),

            function TraineesController_getMentorsOfGeneration(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TraineesController();


              const promise = controller.getMentorsOfGeneration.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/trainees/generations/:id/add-mentor/:memberID',
            authenticateMiddleware([{"jwt":["14"]}]),
            ...(fetchMiddlewares<RequestHandler>(TraineesController)),
            ...(fetchMiddlewares<RequestHandler>(TraineesController.prototype.addMentor)),

            function TraineesController_addMentor(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    memberID: {"in":"path","name":"memberID","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TraineesController();


              const promise = controller.addMentor.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/trainees/generations/:id/internal-projects',
            authenticateMiddleware([{"jwt":["14"]}]),
            ...(fetchMiddlewares<RequestHandler>(TraineesController)),
            ...(fetchMiddlewares<RequestHandler>(TraineesController.prototype.getInternalProjectsOfGeneration)),

            function TraineesController_getInternalProjectsOfGeneration(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TraineesController();


              const promise = controller.getInternalProjectsOfGeneration.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/trainees/ips/current',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TraineesController)),
            ...(fetchMiddlewares<RequestHandler>(TraineesController.prototype.getCurrentIPs)),

            function TraineesController_getCurrentIPs(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TraineesController();


              const promise = controller.getCurrentIPs.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/trainees/ips/all',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TraineesController)),
            ...(fetchMiddlewares<RequestHandler>(TraineesController.prototype.getAllIPs)),

            function TraineesController_getAllIPs(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TraineesController();


              const promise = controller.getAllIPs.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/trainees/generations/:id/trainee-progress',
            authenticateMiddleware([{"jwt":["14"]}]),
            ...(fetchMiddlewares<RequestHandler>(TraineesController)),
            ...(fetchMiddlewares<RequestHandler>(TraineesController.prototype.getTraineeProgress)),

            function TraineesController_getTraineeProgress(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TraineesController();


              const promise = controller.getTraineeProgress.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/trainees/admission/:id',
            authenticateMiddleware([{"jwt":["18"]}]),
            ...(fetchMiddlewares<RequestHandler>(TraineesController)),
            ...(fetchMiddlewares<RequestHandler>(TraineesController.prototype.admitTrainee)),

            function TraineesController_admitTrainee(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TraineesController();


              const promise = controller.admitTrainee.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, _response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthentication(request, name, secMethod[name])
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthentication(request, name, secMethod[name])
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await promiseAny.call(Promise, secMethodOrPromises);
                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, successStatus: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode = successStatus;
                let headers;
                if (isController(controllerObj)) {
                    headers = controllerObj.getHeaders();
                    statusCode = controllerObj.getStatus() || statusCode;
                }

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                returnHandler(response, statusCode, data, headers)
            })
            .catch((error: any) => next(error));
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function returnHandler(response: any, statusCode?: number, data?: any, headers: any = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name: string) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            response.status(statusCode || 200)
            data.pipe(response);
        } else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        } else {
            response.status(statusCode || 204).end();
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function responder(response: any): TsoaResponse<HttpStatusCodeLiteral, unknown>  {
        return function(status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any, response: any): any[] {
        const fieldErrors: FieldErrors  = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'queries':
                    return validationService.ValidateParam(args[key], request.query, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    }
                case 'res':
                    return responder(response);
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
