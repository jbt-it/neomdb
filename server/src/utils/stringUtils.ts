/**
 * Returns a random string containing numbers and characters
 * @param length The length of the random string
 * @returns A random string with the specified length
 */
export const getRandomString = (length) => {
  const randomChars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
};
