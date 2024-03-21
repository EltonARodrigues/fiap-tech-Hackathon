/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { format,lastDayOfMonth, parseISO, startOfDay, endOfDay } from 'date-fns'
import RegisterRepository, { FilterUserRegister, RegisterDTO } from "~domain/repositories/registerRepository";

import RegisterModel from "../models/registerModel";

interface DbFilter {
  clientId: string,
  date?: any,
}
class RegisterDataBaseRepository implements RegisterRepository {
  async findEmployeeRegisters(filter: FilterUserRegister): Promise<RegisterDTO[]> {

    const dbFIlter: DbFilter = {
      clientId: filter.clientId
    }

    if (filter.date) {
      console.log(filter.date)
      const date = parseISO(filter.date);
      const registerDateStart = startOfDay(date);
      const registerDateEnd = endOfDay(date);
      dbFIlter.date = {
        $gte: new Date(registerDateStart),
        $lt: new Date(registerDateEnd)
      }
    }

    if (filter.month) {
      const today = new Date();
      const firstDateOfMonth = startOfDay(new Date(format(today, 'yyyy-MM-01')));
      const lastDateOfMonth = lastDayOfMonth(today);
      dbFIlter.date = {
        $gte: new Date(firstDateOfMonth),
        $lt: new Date(lastDateOfMonth)
      }
    }
    console.log(dbFIlter)
    return await RegisterModel.find(dbFIlter).sort({ date: 1 }).select("-_id -__v");
  }

  async getLastEmployeeRegister(clientId: string) {
    const registerDateStart = startOfDay(new Date());
    const registerDateEnd = endOfDay(new Date());
    const dbFIlter: DbFilter = {
      clientId,
      date: {
        $gte: registerDateStart,
        $lt: registerDateEnd
      }
    }
    return await RegisterModel.findOne(dbFIlter).sort({ date: -1 }).select("-_id -__v");
  }

  async registerEmployee(register: RegisterDTO): Promise<RegisterDTO> {
    return await RegisterModel.create(register);
  }
}

export default RegisterDataBaseRepository;
