/**
 * Class that facilitates working with dates
 */

const dateOptions = {day: "2-digit", year: "numeric", month: "2-digit"};
const dateTimeOptions = {day: "2-digit", year: "numeric", month: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit"};
const locales = "de-DE";

/**
 * Returns the current date as a string that can be interpreted by SQL
 * @returns the current date and time in yyyy-mm-dd hh:mm:ss format
 */
export const getCurrentDateAsSQL = () => {
    const date = new Date();
    return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " "
    + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
};

/**
 * Returns the given date as a string that can be interpreted by SQL
 * @param {Date} date the date to convert
 * @returns the date and time in yyyy-mm-dd hh:mm:ss format
 */
export const getDateAsSQL = (date:Date) => {
    return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " "
    + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
};

/**
 * Converts an sql datetime into a string dd.MM.yyyy (hh:mm:ss)
 * @param {Date} date the sql date to convert into a string
 * @param {boolean} withTime a boolean that specifies if the string should contain time
 * @returns the date and time if not otherwise specified
 */
export const sqlDateTimeToString = (date:Date, withTime:boolean=true) => {
    if (withTime) {
        return (new Date(date).toLocaleDateString(locales, dateTimeOptions));
    } else {
        return (new Date(date).toLocaleDateString(locales, dateOptions));
    }
};

/**
 * Converts a date as a string to a string in sql-readable form (yyyy-MM-dd hh:mm:ss)
 * @param stringDate the date as a string to convert into a sql-readable string
 * @param withTime a boolean that specifies if the string contains time
 */
export const stringToSql = (stringDate:string, withTime:boolean=false) => {
    if (withTime) {
        const dateElements = stringDate.split(" ")[0].split(".");
        const timeElements = stringDate.split(" ")[1].split(":");
        return dateElements[2] + "-" + dateElements[1] + "-" + dateElements[0] + " " + timeElements[0] + ":" + timeElements[1] + ":" + timeElements[2];
    } else {
        const dateElements = stringDate.split(".");
        return dateElements[2] + "-" + dateElements[1] + "-" + dateElements[0];  
    }
};