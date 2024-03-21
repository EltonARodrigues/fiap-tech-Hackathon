import { differenceInHours, format, sub } from "date-fns";
import dotenv from "dotenv";

import Register from "~domain/entities/register";
import FilaRepository from "~domain/repositories/filaRepository";
import RegisterRepository, { FilterUserRegister, RegisterDTO } from "~domain/repositories/registerRepository";

dotenv.config();

const NOTIFICATION_QUEUE = process.env.NOTIFICATION_QUEUE as string;

export default class RegisterUseCase {
  static async registerEmployee(
    registerRepository: RegisterRepository,
    clientId: string
  ) {

    const lastRegister = await registerRepository.getLastEmployeeRegister(clientId);
    let type = '';
    if (!lastRegister) {
      type = 'ENTRADA';
    }
    if (lastRegister?.type === 'ENTRADA') {
      type = 'INTERVALO';
    }
    if (lastRegister?.type === 'INTERVALO') {
      type = 'RETORNO_INTERVALO';
    }
    if (lastRegister?.type === 'RETORNO_INTERVALO') {
      type = 'SAIDA';
    }
    if (lastRegister?.type === 'SAIDA') {
      throw new Error('Nao permitido novos lancamento no dia')
    }

    const newRegister = new Register({
      clientId,
      date: new Date(),
      type
    });

    const register = await registerRepository.registerEmployee(newRegister);

    return register;
  }

  static countWorkerHours(registers: any) {
    let workedHours = 0;
    let restHours = 0;

    for (let i = 0; i < registers.length; i += 1) {
      const pontoAtual = registers[i];
      const proximoPonto = registers[i + 1];

      const nextDate = proximoPonto?.date ? new Date(proximoPonto.date) : new Date();
      const startDate = new Date(pontoAtual.date);
      switch (pontoAtual.type) {
        case 'ENTRADA':
          workedHours = differenceInHours(nextDate, startDate);
          break;
        case 'INTERVALO':
          restHours = differenceInHours(nextDate, startDate);
          break;
        case 'RETORNO_INTERVALO':
          workedHours += differenceInHours(nextDate, startDate);
          break;
        case 'SAIDA':
          break;
        default:
          break
      }
    }
    return { workedHours, restHours };
  }

  static async findEmployeeRegisters(
    registerRepository: RegisterRepository,
    clientId: string,
    date: string
  ) {
    const filter: FilterUserRegister = {
      clientId,
      date
    }

    const registerList = await registerRepository.findEmployeeRegisters(filter);

    const { restHours, workedHours } = RegisterUseCase.countWorkerHours(registerList);
    return {
      restHours,
      workedHours,
      registers: registerList
    };

  }

  static async sendReportNotification(
    filaRepository: FilaRepository,
    registerRepository: RegisterRepository,
    clientId: string
  ) {

    const filter: FilterUserRegister = {
      clientId,
      lastMonth: true
    }

    const reports = await registerRepository.findEmployeeRegisters(filter);
    try {
      let dayReport: RegisterDTO[] = [];
      let totalWorkedHours = 0;
      let message = reports.reduce((msg, report) => {
        dayReport.push(report)
        if (report.type === 'ENTRADA') {
          dayReport = [report];
          msg += `${format(report.date, 'yyyy-MM-dd')}\n`;
        }
        msg += `${report.type} ${format(report.date, 'yyyy-MM-dd hh:mm:ss')}\n`
        if (report.type === 'SAIDA') {
          const { restHours, workedHours } = RegisterUseCase.countWorkerHours(dayReport);
          totalWorkedHours += workedHours;
          msg += `WORKED HOURS: ${workedHours}h REST HOURS: ${restHours}h\n\n`;
        }
        return msg;
      }, '');

      message = `TOTAL MOUNT HOURS WORKED: ${totalWorkedHours}h\n\n${message}`
      console.log(message)
      await filaRepository.enviaParaFila(message, NOTIFICATION_QUEUE);

    } catch (err) {
      throw new Error('Erro to send notification');
    }

    return null;
  }
}
