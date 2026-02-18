// Force restart - Merge Auth
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import * as swaggerUi from "swagger-ui-express";
import config from "./config";
import v1 from "./api/v1";
import errorHandler from "./middleware/error-handler";
import morganMiddleware from "./middleware/morgan-middleware";
import swaggerSpec from "./config/swagger";

export const createServer = () => {
  const app = express();

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

  app
    .use(helmet())
    .use(limiter)
    .disable("x-powered-by")
    .use(morganMiddleware)
    .use(cookieParser())
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(
      cors({
        origin: (origin, callback) => {
          // Allow all origins but echo back the origin for credentials support
          callback(null, true);
        },
        credentials: true,
      })
    );


  /**
   * @openapi
   * /health:
   *   get:
   *     tags:
   *       - Health
   *     description: Health check endpoint
   *     responses:
   *       200:
   *         description: Returns status ok
   */
  app.get("/health", (req: Request, res: Response) => {
    res.json({ ok: true, environment: config.env });
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/v1", v1);

  app.use(errorHandler);

  return app;
};
