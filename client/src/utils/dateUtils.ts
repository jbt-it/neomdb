/**
 * Class that facilitates working with dates
 */

// Options for formatting dates
const dateOptions: Intl.DateTimeFormatOptions = { day: "2-digit", year: "numeric", month: "2-digit" };

// Local option (formats dates and datetimes into the german format dd.mm.yyyy hh.MM.ss)
const locales = "de-DE";

/**
 * Transforms a date to a readable string
 * @param date The date to transform
 * @returns The date as a readable string
 */
export const transformDateToReadableString = (date: Date) => {
  return date.toLocaleDateString(locales, dateOptions);
};

/**
 * Transforms a sql date in string format to a german date in string format
 * @param sqlString A sql date in string format
 * @returns The sql date as a german date in string format
 */
export const transformSQLStringToGermanDate = (sqlString: string | null) => {
  if (sqlString === null) {
    return "";
  }
  return new Date(sqlString).toLocaleDateString(locales, dateOptions);
};

/**
 * Transforms a german date in string format to a sql date in string format
 * @param germanDate A german date in string format
 * @returns The german date as a sql date in string format or null
 */
export const transformGermanDateToSQLString = (germanDate: string) => {
  if (germanDate === "") {
    return null;
  }
  const dateElements = germanDate.split(".");
  return dateElements[2] + "-" + dateElements[1] + "-" + dateElements[0];
};

/**
 * Transforms the date to an sql date string
 * @param date The date to transform
 * @returns The date as an sql string
 */
export const transfromDateToSQLDate = (date: Date) => {
  return date.toISOString().slice(0, 19).replace("T", " ");
};

/**
 * Transforms a date in string format to a sql date in string format
 * @param dateString A date in string format
 * @returns The date as a sql date in string format
 */
export const transformStringToSQLString = (dateString: string | null) => {
  if (dateString === null) {
    return null;
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return null;
  }
  //return date.getFullYear() + "-" + ("00" + (date.getMonth() + 1)).slice(-2) + "-" + ("00" + date.getDate()).slice(-2);

  return transfromDateToSQLDate(date);
};
