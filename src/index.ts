import dotenv from "dotenv";

import connectDB from "~datasources/databaseNoSql/config/init";
import seedDB from "~datasources/databaseNoSql/seed/lastMonthData";
import API from "~presenters/api";

dotenv.config();

async function init() {
  await connectDB();
  await seedDB();
  const api = new API();
  api.start();
}

init();
