import connectDB from "../config/init";
import RegisterModel from "../models/registerModel";

const lastMonthFakeData = [
  {
    "clientId": "1111",
    "date": new Date("2024-02-04T09:55:32.998Z"),
    "type": "ENTRADA",
  },
  {

    "clientId": "1111",
    "date": new Date("2024-02-04T12:55:34.246Z"),
    "type": "INTERVALO",
  },
  {

    "clientId": "1111",
    "date": new Date("2024-02-04T13:55:35.085Z"),
    "type": "RETORNO_INTERVALO",
  },
  {
    "clientId": "1111",
    "date": new Date("2024-02-04T18:55:35.855Z"),
    "type": "SAIDA",
  },
  {
    "clientId": "1111",
    "date": new Date("2024-02-02T09:55:32.998Z"),
    "type": "ENTRADA",
  },
  {

    "clientId": "1111",
    "date": new Date("2024-02-02T12:55:34.246Z"),
    "type": "INTERVALO",
  },
  {

    "clientId": "1111",
    "date": new Date("2024-02-02T13:55:35.085Z"),
    "type": "RETORNO_INTERVALO",
  },
  {
    "clientId": "1111",
    "date": new Date("2024-02-02T18:55:35.855Z"),
    "type": "SAIDA",
  },
  {
    "clientId": "1111",
    "date": new Date("2024-02-03T09:55:32.998Z"),
    "type": "ENTRADA",
  },
  {

    "clientId": "1111",
    "date": new Date("2024-02-03T12:55:34.246Z"),
    "type": "INTERVALO",
  },
  {

    "clientId": "1111",
    "date": new Date("2024-02-03T13:55:35.085Z"),
    "type": "RETORNO_INTERVALO",
  },
  {
    "clientId": "1111",
    "date": new Date("2024-02-03T18:55:35.855Z"),
    "type": "SAIDA",
  },
  {

    "clientId": "1111",
    "date": new Date("2024-02-01T12:55:34.246Z"),
    "type": "ENTRADA",
  },
  {

    "clientId": "1111",
    "date": new Date("2024-02-01T12:55:34.246Z"),
    "type": "INTERVALO",
  },
  {

    "clientId": "1111",
    "date": new Date("2024-02-01T15:55:35.085Z"),
    "type": "RETORNO_INTERVALO",
  },
  {
    "clientId": "1111",
    "date": new Date("2024-02-01T18:55:35.855Z"),
    "type": "SAIDA",
  },
]

export default async function seedDB() {

  try {
    const register = await RegisterModel.findOne({ date: lastMonthFakeData[0].date }).sort({ date: -1 });

    if (!register) {
      await RegisterModel.create(lastMonthFakeData);
      console.log("Database seeded! :)");
    }

  } catch (err) {
    console.log(err);
  }
}

