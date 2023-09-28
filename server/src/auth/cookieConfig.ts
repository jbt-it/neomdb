import { CookieOptions } from "express-serve-static-core";

/**
 * Options for the cookie
 */
export const cookieOptions: CookieOptions = {
  httpOnly: true, // Cookie is only accesible via the browser
  secure: process.env.IS_PRODUCTION ? true : false, // Cookie can only be sent to an HTTPS page in production
  sameSite: process.env.IS_PRODUCTION ? "strict" : "lax", // In development cookie can be sent to the same domain
};

/**
 * Returns a string representation of the cookie options which can be used in the Set-Cookie header
 */
export const getCookieOptionsAsString = (): string => {
  // Use the cookieOptions to create a string that can be used in the Set-Cookie header
  let cookieOptionsAsString = "";
  for (const [key, value] of Object.entries(cookieOptions)) {
    // If the value is a boolean, only add the key to the string
    if (typeof value === "boolean") {
      cookieOptionsAsString += `${key}; `;
      continue;
    }
    cookieOptionsAsString += `${key}=${value}; `;
  }
  return cookieOptionsAsString;
};
