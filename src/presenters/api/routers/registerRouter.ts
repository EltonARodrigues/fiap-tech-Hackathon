import express, { NextFunction, Request, Response } from "express";

import { RegisterController } from "controllers/registerController";
import FilaService from "~datasources/queues/FilaService";
import RegisterDataBaseRepository from "~datasources/databaseNoSql/repository/registerDatabaseRepository";

const registerRouter = express.Router({});

const filaService = new FilaService();
const dbRegisterRepository = new RegisterDataBaseRepository();

/**
 * @openapi
 * /employee/register:
 *   get:
 *     summary: Registra a hora do ponto
 *     tags:
 *       - Employee
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Cria um registro de hora de entrada/saida.
 */
registerRouter.get(
  "/employee/register",
  async (
    req: Request<unknown, unknown>,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const clientId = "1111" // TODO
      const newRegister = await RegisterController.registerEmployee(
        dbRegisterRepository,
        clientId
      );

      return res.status(201).json({
        status: "success",
        message: newRegister,
      });
    } catch (err: unknown) {
      return next(err);
    }
  }
);

/**
 * @openapi
 * /employee/register/find:
 *   get:
 *     summary: filta e lista registros de ponto do usuário
 *     tags:
 *       - Employee
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: lista os registros.
 *       404:
 *         description: registro nao encontrado.
 *       500:
 *         description: Erro na api.
 */
registerRouter.get(
  "/employee/register/find",
  async (
    req: Request<unknown, unknown>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { query } = req; // TODO
      const clientId = "1111" // TODO

      const registers = await RegisterController.findEmployeeRegisters(
        dbRegisterRepository,
        clientId
      )

      return res.status(200).json({
        status: "success",
        message: registers,
      });
    } catch (err: unknown) {
      return next(err);
    }
  }
);


/**
 * @openapi
 * /employee/register/report:
 *   get:
 *     summary: Envia notificacao por email do das horas
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Envia notificacao.
 *       404:
 *         description: registros nao encontrado.
 *       500:
 *         description: Erro na api.
 */
registerRouter.get(
  "/register/report",
  async (
    req: Request<unknown, unknown>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { query } = req; // TODO
      const clientId = "1111" // TODO

      const registers = await RegisterController.sendReportNotification(
        filaService,
        dbRegisterRepository,
        clientId
      )

      return res.status(200).json({
        status: "success",
        message: registers,
      });
    } catch (err: unknown) {
      return next(err);
    }
  }
);



export default registerRouter;
