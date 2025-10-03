import jwt from "jsonwebtoken";
import Doctor from "../schemas/doctor.js";
import ClientError from "../helpers/client_error.js";

const ACCESS_TOKEN_KEY = process.env.JWT_ACCESS_TOKEN_KEY;
const REFRESH_TOKEN_KEY = process.env.JWT_REFRESH_TOKEN_KEY;
const ACCESS_EXPIRATION = { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME };
const REFRESH_EXPIRATION = {
  expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
};

export async function generateTokens(credentials) {
  const doctor = await Doctor.findOne({ credentials });

  if (!doctor) {
    throw new ClientError("Access Denied, invalid credentials", 401);
  }

  const accessToken = jwt.sign(
    {
      doctorID: doctor._id,
      role: "doctor",
    },
    ACCESS_TOKEN_KEY,
    ACCESS_EXPIRATION
  );

  const refreshToken = jwt.sign(
    {
      doctorID: doctor._id,
      role: "doctor",
    },
    REFRESH_TOKEN_KEY,
    REFRESH_EXPIRATION
  );

  return {
    accessToken,
    refreshToken,
    doctor,
  };
}

export async function generateAdminTokens(adminCode, doctorID) {
  if (adminCode !== process.env.JWT_ADMIN_HEADER_KEY) {
    throw new ClientError("Access Denied, invalid credentials", 401);
  }

  const JWTdata = {
    // Uncomment if you want to impersonate doctor
    // role: "doctor",
    // doctorID: doctorID,
    role: "admin",
  };

  const accessToken = jwt.sign(JWTdata, ACCESS_TOKEN_KEY, ACCESS_EXPIRATION);

  const refreshToken = jwt.sign(JWTdata, REFRESH_TOKEN_KEY, REFRESH_EXPIRATION);

  return {
    accessToken,
    refreshToken,
  };
}

export async function refresh(refreshToken, doctorID) {
  return jwt.verify(refreshToken, REFRESH_TOKEN_KEY, (err, JWTdata) => {
    if (err)
      throw new ClientError(
        "Access Denied. Refresh Token is invalid, please login.",
        401
      );

    if (JWTdata.doctorID != doctorID && JWTdata.role !== "admin")
      throw new ClientError("Access Denied. Token is malformed, relogin.", 400);

    const accessToken = jwt.sign(
      { doctorID: JWTdata.doctorID, role: JWTdata.role },
      ACCESS_TOKEN_KEY,
      ACCESS_EXPIRATION
    );

    return accessToken;
  });
}
