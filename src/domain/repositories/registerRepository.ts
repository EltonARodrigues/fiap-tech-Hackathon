import Register from "~domain/entities/register";

export interface RegisterBaseDTO{
  clientId: string;
  date: Date;
}

export interface RegisterDTO extends RegisterBaseDTO {
  id?: string;
}

export interface FilterUserRegister {
  clientId: string;
}

export default interface RegisterRepository {
  findEmployeeRegisters(filter: FilterUserRegister): Promise<RegisterDTO[]>;
  // getLastMonth(filter: FilterUserRegister): Promise<RegisterDTO[]>;
  registerEmployee(register: Register): Promise<RegisterDTO>;
}
