import dotenv from "dotenv";

import connectDB from "~datasources/databaseNoSql/config/init";
import API from "~presenters/api";

dotenv.config();

async function init() {
  await connectDB();
  const api = new API();
  api.start();
}

init();
