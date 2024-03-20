import { Express, Router } from "express";


export interface ServerInterface {
  appConfig: Express;
  port?: number;
  init: () => Promise<void>;
  config: () => Promise<Express>;
  addRouter: (routeBase: string, router: Router) => void;
}

export type ServerConstructorInterface = Pick<
  ServerInterface,
  "appConfig"
>;
