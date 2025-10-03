import mongoose from "mongoose";
import ClientError from "../helpers/client_error.js";

import bcrypt from "bcrypt";

const AddressSchema = new mongoose.Schema({
  street: String,
  streetNumber: String,
  city: String,
  country: String,
  zip: String,
});

const ContactSchema = new mongoose.Schema({
  phone: String,
  email: String,
});

const UserSchema = new mongoose.Schema(
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
    healthStructures: [
      { type: mongoose.Schema.Types.ObjectId, ref: "HealthStructure" },
    ],
  },
  { timestamps: true }
);

UserSchema.statics.register = async function (newUser) {
  const existing = await User.findOne({ username });

  const user = new User();
  // user.details = {
  //   email: googleAccount.email ?? null,
  //   };

  user.username = newUser.username;
  user.password = newUser.password;

  if (existing) {
    throw new Error("User already exists");
  }

  await user.save().catch((err) => {
    throw new ClientError(
      "User creation from google account failed:\n" + err.message,
      500,
      true
    );
  });

  return user;
};

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// PRE --- MIDDLEWARE

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if changed
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// PRE --- MIDDLEWARE

UserSchema.statics.testAccount = function () {
  return new User(DEMO_ENTRIES.USER);
};

const User = mongoose.model("User", UserSchema);

export default User;
