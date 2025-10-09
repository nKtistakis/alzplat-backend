import mongoose from "mongoose";
import DEMO_ENTRIES from "../helpers/DEMO_ENTRIES.js";

const AddressSchema = new mongoose.Schema({
  street: String,
  streetNumber: String,
  city: String,
  country: String,
  zip: String,
  _id: false,
});

const ContactSchema = new mongoose.Schema({
  phone: String,
  email: String,
  _id: false,
});

const healthStructureSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: AddressSchema,
    contact: ContactSchema,
    doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
  },
  { timestamps: true }
);

healthStructureSchema.statics.testHealthStructure = function () {
  return new HealthStructure(DEMO_ENTRIES.HEALTH_STRUCTURE);
};

const HealthStructure = mongoose.model(
  "HealthStructure",
  healthStructureSchema
);

export default HealthStructure;
