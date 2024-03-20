import FilaRepository from "~domain/repositories/filaRepository";
import RegisterRepository, { RegisterDTO } from "~domain/repositories/registerRepository";
import RegisterUseCase from "~domain/useCases/registerUseCase";

export class RegisterController {
  static async registerEmployee(
    registerRepository: RegisterRepository,
    clientId: string
  ): Promise<RegisterDTO> {
    return await RegisterUseCase.registerEmployee(
      registerRepository,
      clientId
    );
  }

  static async findEmployeeRegisters(
    registerRepository: RegisterRepository,
    clientId: string
  ): Promise<RegisterDTO[]> {
    return await RegisterUseCase.findEmployeeRegisters(
      registerRepository,
      clientId
    );
  }

  static async sendReportNotification(
    filaRepository: FilaRepository,
    registerRepository: RegisterRepository,
    clientId: string
  ) {
    await RegisterUseCase.sendReportNotification(
      filaRepository,
      registerRepository,
      clientId
    );
  }
}
