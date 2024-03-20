import dotenv from "dotenv";
import { connect } from "mongoose";

dotenv.config();

export default async function connectDB() {
  try {
    const DB_URI = process.env.DB_URI as string;
    console.log(DB_URI);
    await connect(DB_URI, {
      retryWrites: false,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(`cMongoDB connection error: ${err}`);
    await connectDB();
  }
}
