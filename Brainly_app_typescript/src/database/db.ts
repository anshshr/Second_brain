import mongoose, { connection } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const url = process.env.MONGODB_URI || "";

async function databaseConnections() {
  const connection = await mongoose.connect(url);
  console.log("database connected successfully");
}

export default databaseConnections;
