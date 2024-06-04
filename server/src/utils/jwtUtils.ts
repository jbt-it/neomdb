import * as jwt from "jsonwebtoken";
import * as fs from "fs";
import { JWTPayload } from "../typeOrm/types/authTypes";
import { Request } from "express";

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
 * Extracts the JWT from the header
 * @param header the header containing the JWT
 * @returns the JWT
 */
export const extractJWTFromHeader = (header: string): string => {
  if (header === undefined) {
    return null;
  }
  return header.split(" ")[1];
};

/**
 * Generates JWT based on query results for the login process
 * @param payload object containing non sensitive user data
 * @returns the signed JWT
 */
export const generateJWT = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWTKeys.private, JWTSignOptions);
};

/**
 * Verifies recived JWT from the user and returnes decoded payload or false
 * @param token JWT sent with the users request
 * @returns decoded payload, false if token is invalid or null if an error occured
 */
export const verifyJWT = (token: string): null | JWTPayload => {
  try {
    return jwt.verify(token, JWTKeys.public, JWTVerifyOptions) as JWTPayload;
  } catch (err) {
    return null;
  }
};

/**
 * Checks if the JWT exists and is valid
 * @param req The request object containing the JWT in the header or cookie
 * @returns true if the JWT is valid
 */
export const checkForValidJWT = (req: Request): boolean => {
  return (
    (req.headers.authorization && verifyJWT(extractJWTFromHeader(req.headers.authorization)) !== null) ||
    (req.cookies && req.cookies.token && verifyJWT(req.cookies.token) !== null)
  );
};
