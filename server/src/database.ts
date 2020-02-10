/**
 * Wrapper for the MySQL connections
 */
import mysql = require("mysql");

/**
 * Config for the MySQL database
 */
const databaseConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

/**
 * Create connection to database
 */
const connectDatabase = (): mysql.Connection => {
  const connection = mysql.createConnection(databaseConfig);

  connection.connect((err): mysql.MysqlError => {
    if (err) {
      console.error("Error connecting database \n" + err.stack);
      return;
    }
    console.log("Database connection established ...");
  });
  return connection;
};

module.exports = connectDatabase();