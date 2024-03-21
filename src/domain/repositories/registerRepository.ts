import Register from "~domain/entities/register";

export interface RegisterBaseDTO{
  clientId: string;
  date: Date;
  type?: string;
}

export interface RegisterDTO extends RegisterBaseDTO {
  id?: string;
}

export interface FilterUserRegister {
  clientId: string;
  date?: string;
  month?: string;
}

export default interface RegisterRepository {
  findEmployeeRegisters(filter: FilterUserRegister): Promise<RegisterDTO[]>;
  getLastEmployeeRegister(clientId: string): Promise<RegisterDTO | null>;
  // getLastMonth(filter: FilterUserRegister): Promise<RegisterDTO[]>;
  registerEmployee(register: Register): Promise<RegisterDTO>;
}
