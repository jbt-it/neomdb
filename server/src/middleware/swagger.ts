import { Request, Response } from "express";
import * as swaggerUi from "swagger-ui-express";
import * as originalSwaggerDocument from "../../build/swagger.json";

// SwaggerDocument used for generating the swagger-ui html page with the correct base path (specified in tsoa.json)
const swaggerDocument = {
  ...originalSwaggerDocument,
  servers: [
    {
      url: "/api", // Manual prefix for all routes (this is only for swagger-ui, the tsoa configuration is done in tsoa.json - see basePath)
    },
  ],
};

/**
 * Middleware for serving the swagger documentation of the API
 */
const swagger = async (_req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(swaggerDocument));
};

export default swagger;
