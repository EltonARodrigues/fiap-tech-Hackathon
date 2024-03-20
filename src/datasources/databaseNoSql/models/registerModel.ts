import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { RegisterDTO } from "~domain/repositories/registerRepository";

const RegisterSchema = new mongoose.Schema<RegisterDTO>({
  id: {
    type: String,
    default: uuidv4,
    required: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const RegisterModel = mongoose.model("Register", RegisterSchema);

export default RegisterModel;
