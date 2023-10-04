/**
 * Returns the status change date attribute for a given status.
 * It is used to get the correct attribute to update.
 * @param status The status to get the change date for (e.g. "Trainee")
 * @returns The attribute corresponding to the status (e.g. "trainee_seit")
 */
const getStatusChangeDate = (status: string) => {
  switch (status) {
    case "Trainee":
      return "trainee_seit";
    case "aktives Mitglied":
      return "aktiv_seit";
    case "Senior":
      return "senior_seit";
    case "Alumnus":
      return "alumnus_seit";
    case "passives Mitglied":
      return "passiv_seit";
    case "Ausgetretene":
      return "ausgetreten_seit";
    default:
      return null;
  }
};

export default getStatusChangeDate;
