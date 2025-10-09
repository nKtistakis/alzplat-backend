import mongoose from "mongoose";
import ClientError from "../helpers/client_error.js";

import bcrypt from "bcrypt";
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

const DoctorSchema = new mongoose.Schema(
  {
    credentials: {
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true, unique: true },
      _id: false,
    },
    name: String,
    address: AddressSchema,
    contact: ContactSchema,
    speciality: String,
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }],
    health_structure: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "HealthStructure",
    },
  },
  { timestamps: true }
);

DoctorSchema.statics.register = async function (newDoctor) {
  const existing = await Doctor.findOne({ username });

  const doctor = new Doctor();
  // doctor.details = {
  //   email: googleAccount.email ?? null,
  //   };

  doctor.username = newDoctor.username;
  doctor.password = newDoctor.password;

  if (existing) {
    throw new Error("Doctor already exists");
  }

  await doctor.save().catch((err) => {
    throw new ClientError(
      "Doctor creation from google account failed:\n" + err.message,
      500,
      true
    );
  });

  return doctor;
};

DoctorSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// PRE --- MIDDLEWARE

DoctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if changed
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// PRE --- MIDDLEWARE

DoctorSchema.statics.testDoctor = function () {
  return new Doctor(DEMO_ENTRIES.DOCTOR);
};

const Doctor = mongoose.model("Doctor", DoctorSchema);

export default Doctor;
