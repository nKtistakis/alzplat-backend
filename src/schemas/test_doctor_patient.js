import mongoose from "mongoose";
import DEMO_ENTRIES from "../helpers/DEMO_ENTRIES.js";

const TestDoctorPatientSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  name: String,
  status: { type: mongoose.Schema.Types.ObjectId, ref: "Status" },
  startDate: Date,
  endDate: Date,
  results: { scorePercent: Number, notes: String },
});

TestDoctorPatientSchema.statics.testTestDoctorPatient = function () {
  return new TestDoctorPatient(DEMO_ENTRIES.TEST_DOCTOR_PATIENT);
};

const TestDoctorPatient = mongoose.model(
  "TestDoctorPatient",
  TestDoctorPatientSchema
);

export default TestDoctorPatient;
