/**
 * Type of the partial member
 */
export type MemberPartial = {
  vorname: string;
  nachname: string;
  handy: number;
  jbt_email: string;
  mitgliedstatus: string;
  ressort: string;
  lastchange: string;
};

/**
 * Type of the partial department with just the id
 */
export type DepartmentPartialID = {
  ressortID: number;
};
