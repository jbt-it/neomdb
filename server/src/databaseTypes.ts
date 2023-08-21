import mysql = require("mysql2");

/**
 * Custom type for the result of a query
 * It bundles the different possible results of a query together
 */
export type QueryResult = mysql.RowDataPacket[][] | mysql.RowDataPacket[] | mysql.OkPacket[];
