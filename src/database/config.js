import mongoose from "mongoose";
import {} from "dotenv/config";

import User from "../schemas/user.js";

const mongo_uri =
  "mongodb://" +
  process.env.MONGO_USERNAME +
  ":" +
  process.env.MONGO_PASS +
  "@" +
  process.env.MONGO_HOST +
  "/responsy?authSource=admin";

// Perform the inital try to connect to the database
export async function initDbConnection() {
  console.log("Connecting to database....");
  return await mongoose
    .connect(mongo_uri, {
      serverSelectionTimeoutMS: 8000, //Set timeout connection time to 8 seconds
      heartbeatFrequencyMS: 1000,
      socketTimeoutMS: 10000,
    })
    .then(() => {
      console.warn("Connected to MongoDB");
      return true;
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error.message);
      SlackBot.sendErrorStackToSlackBot(
        "Backend server did not launch successfully! Database Connection could not be established due to:\n" +
          error
      );
      return false;
    });
}

// DATABASE BOMBING
export async function empty() {
  if (process.env.NODE_ENV == "production")
    return "Action not allowed on production environment";

  await User.collection.drop();

  return "BOMBED";
}
