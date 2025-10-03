import mongoose from "mongoose";
import DEMO_ENTRIES from "../helpers/DEMO_ENTRIES.js";

const StatusSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: String,
});

StatusSchema.statics.testStatus = function () {
  return new Status(DEMO_ENTRIES.STATUS);
};

const Status = mongoose.model("Status", StatusSchema);

export default Status;
