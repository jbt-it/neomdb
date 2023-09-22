/**
 * Returns a random string containing numbers and characters
 * @param length The length of the random string
 * @returns A random string with the specified length
 */
export const getRandomString = (length) => {
  const randomChars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
};

/**
 * Checks for given string if ist includes any SQL keywords
 * Excluding some small keywords like as, if, on...
 * @param query The query that should be tested
 * @returns true if the input query contains a SQL keyword, else return false
 */
export const checkForSQLKeywords = (query: string): boolean => {
  const sqlKeywords = [
    "ADD",
    "ALL",
    "ALTER",
    "AND",
    "ANY",
    "ASC",
    "BACKUP",
    "BETWEEN",
    "CASE",
    "CHECK",
    "COLUMN",
    "CONSTRAINT",
    "CREATE",
    "DATABASE",
    "DEFAULT",
    "DELETE",
    "DESC",
    "DISTINCT",
    "DROP",
    "EXEC",
    "EXISTS",
    "FOREIGN",
    "FROM",
    "FULL",
    "GROUP",
    "HAVING",
    "INDEX",
    "INNER",
    "INSERT",
    "INTO",
    "JOIN",
    "LEFT",
    "LIKE",
    "LIMIT",
    "NOT",
    "NULL",
    "ORDER",
    "OUTER",
    "PRIMARY",
    "PROCEDURE",
    "RIGHT",
    "ROWNUM",
    "SELECT",
    "SET",
    "TABLE",
    "TOP",
    "TRUNCATE",
    "UNION",
    "UNIQUE",
    "UPDATE",
    "VALUES",
    "VIEW",
    "WHERE",
  ];
  // Lower case the query
  const queryLower = query.toLowerCase();
  // Lower SQL keywords and compare
  return sqlKeywords.some((str) => queryLower.includes(str.toLowerCase()));
};
