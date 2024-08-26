/**
 * Formats given `date` to  a string with structure "yyyy-mm-dd hh:mm:ss"
 * @param date {Date} - Date to be formatted
 * @returns {string} - Formatted date string with structure "yyyy-mm-dd hh:mm:ss"
 */
const formatDate = (date: Date) => {
  const formattedDate =
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

  return formattedDate;
};

/**
 * Computes the difference between two dates in days
 * @param date1 The first date
 * @param date2 The second date
 * @returns The difference between the two dates in days
 */
export const getDateDifferenceInDays = (date1: Date, date2: Date) => {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const timeDiff = date1.getTime() - date2.getTime();
  const daysDiff = Math.floor(timeDiff / millisecondsPerDay);

  return parseFloat(daysDiff.toFixed(1));
};

export default formatDate;
