import mongoose from "mongoose";
import DEMO_ENTRIES from "../helpers/DEMO_ENTRIES.js";

const StatusSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, default: "PENDING" },
  name: String,
});

StatusSchema.statics.testStatus = function () {
  return new Status(DEMO_ENTRIES.STATUS);
};

StatusSchema.statics.initialCategories = async function () {
  const pending = new Status({
    name: "Pedning",
    code: "PENDING",
    _id: new mongoose.Types.ObjectId("68e00b2f4f4c3b4f5c8b5678"),
  });

  const inprogress = new Status({
    name: "In-Progress",
    code: "INPROGRESS",
    _id: new mongoose.Types.ObjectId("68ee8739935d59670736b1ac"),
  });
  const completed = new Status({
    name: "Completed",
    code: "COMPLETED",
    _id: new mongoose.Types.ObjectId("68ee874c170d4f45459cd0bf"),
  });

  await Status.bulkSave([inprogress, pending, completed]);
};

const Status = mongoose.model("Status", StatusSchema);

export default Status;
