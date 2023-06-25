import jwt = require("jsonwebtoken");
import fs = require("fs");
import * as globalTypes from "../global/globalTypes";

/**
 * Keys for the json web token
 */
const JWTKeys = {
  public: fs.readFileSync(process.env.JWT_PUBLIC),
  private: fs.readFileSync(process.env.JWT_PRIVATE),
};

/**
 * Options for the json web token signing
 */
const JWTSignOptions: jwt.SignOptions = {
  expiresIn: 60 * 60 * 10, // Expires in 10 hours
  algorithm: "RS256",
};

/**
 * Options for the json web token verification
 */
const JWTVerifyOptions: jwt.VerifyOptions = {
  algorithms: ["RS256"],
};

/**
 * Generates JWT based on query results for the login process
 * @param payload object containing non sensitive user data
 */
export const generateJWT = (payload: globalTypes.JWTPayload): string => {
  return jwt.sign(payload, JWTKeys.private, JWTSignOptions);
};

/**
 * Verifies recived JWT from the user and returnes decoded payload or false
 * @param token JWT sent with the users request
 */
export const verifyJWT = (token: string): null | globalTypes.JWTPayload => {
  try {
    return jwt.verify(token, JWTKeys.public, JWTVerifyOptions) as globalTypes.JWTPayload;
  } catch (err) {
    return null;
  }
};
