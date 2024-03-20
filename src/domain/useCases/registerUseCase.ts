import dotenv from "dotenv";
import Register from "~domain/entities/register";
import FilaRepository from "~domain/repositories/filaRepository";
import RegisterRepository, { FilterUserRegister } from "~domain/repositories/registerRepository";

dotenv.config();

const NOTIFICATION_QUEUE = process.env.NOTIFICATION_QUEUE as string;

export default class RegisterUseCase {
  static async registerEmployee(
    registerRepository: RegisterRepository,
    clientId: string
  ) {

    const newRegister = new Register({
      clientId,
      date: new Date(),
    });

    const register = await registerRepository.registerEmployee(newRegister);

    return register;
  }

  static async findEmployeeRegisters(
    registerRepository: RegisterRepository,
    clientId: string
  ) {
    const filter: FilterUserRegister = {
      clientId
    }

    return await registerRepository.findEmployeeRegisters(filter);
  }

  static async sendReportNotification(
    filaRepository: FilaRepository,
    registerRepository: RegisterRepository,
    clientId: string
  ) {

    const filter: FilterUserRegister = {
      clientId
    }

    const reports = await registerRepository.findEmployeeRegisters(filter);
    try {
      const message = reports.reduce((msg, report) => {
        return `${report.date}\n`
      }, '');

      await filaRepository.enviaParaFila(message, NOTIFICATION_QUEUE);

    } catch (err) {
      throw new Error('Erro to send notification');
    }

    return null;
  }
}
