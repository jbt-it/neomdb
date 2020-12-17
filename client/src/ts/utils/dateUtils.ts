/**
 * Class that facilitates working with dates
 */

/**
 * Returns the current date as a string that can be interpreted by SQL
 * @returns the current date and time in yyyy-mm-dd hh:mm:ss format
 */
export const getCurrentDateAsSQL = () => {
  const date = new Date();
  return date.getUTCFullYear() + "-" + (date.getUTCMonth()+1) + "-" + date.getUTCDate() + " " + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds();
};

/**
 * Returns the given date as a string that can be interpreted by SQL
 * @param {Date} date the date to convert
 * @returns the date and time in yyyy-mm-dd hh:mm:ss format
 */
export const getDateAsSQL = (date:Date) => {
  return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
};

/**
 * Converts an sql datetime into a string month dd yyyy hh:mm:ss
 * @param {Date} date the sql date to convert into a string
 */
export const sqlDateTimeToString = (date:Date) => {
  return (new Date(date).toString().substring(4, 24));
};

/**
 * Converts an sql date into a string of format dd.mm.yyyy
 * @param {Date} date the sql date to convert into a string
 */
export const sqlDateToString = (date:Date) => {
  const d = new Date(date);
  let s = "";

  if (date.getDate() < 10) {
      s = s + "0" + d.getDate(); 
  } else {
      s = s + d.getDate(); 
  }

  s = s + ".";
  if (d.getMonth()+1 < 10) {
      s = s + "0" + (d.getMonth()+1);
  } else {
      s = s + (d.getMonth()+1);
  }

  s = s + ".";
  s = s + d.getFullYear();
  return s;
};