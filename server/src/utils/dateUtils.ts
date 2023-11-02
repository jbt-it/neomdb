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
 * Creates a timestamp with the current date and time for the `lastChange` field
 */
export const createCurrentTimestamp = () => {
  const date: Date = new Date();
  const formattedDate = formatDate(date);

  return formattedDate;
};

export default formatDate;
