import { json, urlencoded } from "body-parser";
import { Express, NextFunction, Request, Response, Router } from "express";
import { CustomError } from "handlerError/handlerError";
import morgan from "morgan";

import {
  ServerConstructorInterface,
  ServerInterface,
} from "./interfaces/server.config.interface";

export class Server implements ServerInterface {
  appConfig: Express;

  routers: Array<{ [routeBase: string]: Router }>;

  port = Number(process.env.PORT) || 3000;

  constructor({ appConfig }: ServerConstructorInterface) {
    this.appConfig = appConfig;
    this.routers = [];
  }

  getApp() {
    return this.appConfig;
  }

  addRouter(routeBase: string, router: Router): void {
    this.routers.push({ [routeBase]: router });
  }

  async config(): Promise<Express> {
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "test"
    )
      this.appConfig.use(morgan("dev"));

    this.appConfig.use(json());
    this.appConfig.use(urlencoded({ extended: true }));

    this.appConfig.get("/api/health", (req: Request, res: Response) => {
      res.status(200).json({
        status: "success",
        message: "Ok!",
      });
    });

    for (const route of this.routers) {
      const routeBase = Object.keys(route)[0];
      this.appConfig.use(routeBase, route[routeBase]);
    }

    this.appConfig.use(
      (err: CustomError, req: Request, res: Response, next: NextFunction) => {
        if (err.code === "NO_PERMISSION") {
          return res.status(401).json({
            error: {
              message: err.message,
            },
          });
        }

        if (err.code === "NOT_FOUND") {
          return res.status(404).json({
            error: {
              message: err.message,
            },
          });
        }
        console.log(err.code);
        if (err.code === "BAD_REQUEST") {
          return res.status(400).json({
            error: {
              message: err.message,
            },
          });
        }

        return res.status(500).json({
          error: {
            message: err.message,
          },
        });
      }
    );

    this.appConfig.all("*", (req: Request, res: Response) => {
      res.status(404).json({
        status: "fail",
        message: `Route: ${req.originalUrl} does not exist on this server`,
      });
    });

    return this.appConfig;
  }
  async init() {
    try {
      this.config();
      this.appConfig.listen(this.port, async () => {
        console.log(`🚀: Server is running at http://localhost:${this.port}`);
      });
    } catch (err: any) {
      console.error("🚨: Unable to init the server:", err);
    }
  }
}
