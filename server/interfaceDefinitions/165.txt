// get tenderedProjects
[
  {
    projectID: number,
    projectName: string,
    projectDescription: string,
    projectStatus: string,
  }
]

// get projectsByUser
[
  {
  projectID: number,
  projectName: string,
  projectMembers: MemberField[],
}
]

// get allProjects
{
  "projectSneakPeak": {
    "projectID": "Number",
    "projectName":"String",
    "industry":"string",
    "coreCompetencies":"String",
    "start": "Date",
    "end":"Date",
    "BT":"String",
    "projectStatus": "String",
    "abbreviation":"String",
    "companyID": "Number"
  }

}