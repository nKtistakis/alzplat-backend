import mongoose from "mongoose";

const StatusSchema = new Schema({
  code: { type: String, required: true, unique: true },
  name: String,
});

StatusSchema.statics.testStatus = function () {
  return new Status(DEMO_ENTRIES.STATUS);
};

const Status = mongoose.model("Status", StatusSchema);

export default Status;
