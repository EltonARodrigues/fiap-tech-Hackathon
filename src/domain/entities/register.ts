import { v4 as uuidv4 } from "uuid";
import { RegisterDTO } from "~domain/repositories/registerRepository";

export default class Register {
  public id: string
  public clientId: string
  public date: Date
  constructor(register: RegisterDTO) {
    this.id = register?.id ?? uuidv4();
    this.clientId = register?.clientId;
    this.date = register?.date ?? new Date();
  }

  dto() {
    return {
      id: this.clientId,
      clientId: this.clientId,
      date: this.date
    }
  }
}