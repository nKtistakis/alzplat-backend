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

const PatientSchema = new mongoose.Schema({
  name: String,
  address: AddressSchema,
  contact: ContactSchema,
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Doctor",
  },
  conditions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Condition" }],
});

PatientSchema.statics.testPatientnt = function () {
  return new Patient(DEMO_ENTRIES.PATIENT);
};

const Patient = mongoose.model("Patient", PatientSchema);

export default Patient;
