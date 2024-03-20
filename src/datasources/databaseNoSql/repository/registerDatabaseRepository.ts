/* eslint-disable @typescript-eslint/no-non-null-assertion */

import RegisterRepository, { FilterUserRegister, RegisterDTO } from "~domain/repositories/registerRepository";

import RegisterModel from "../models/registerModel";

class RegisterDataBaseRepository implements RegisterRepository {
  async findEmployeeRegisters(filter: FilterUserRegister): Promise<RegisterDTO[]> {
    return await RegisterModel.find(filter).sort({ updateAt: 1 }).select("-_id -__v");
  }

  async registerEmployee(register: RegisterDTO): Promise<RegisterDTO> {
    return await RegisterModel.create(register);
  }
}

export default RegisterDataBaseRepository;
