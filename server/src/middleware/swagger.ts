import { Request, Response } from "express";
import * as swaggerUi from "swagger-ui-express";
import * as swaggerDoc from "../../build/swagger.json";

/**
 * Middleware for serving the swagger documentation of the API
 */
const swagger = async (_req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(swaggerDoc));
};

export default swagger;
