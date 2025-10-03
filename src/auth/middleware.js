import jwt from "jsonwebtoken";
import User from "../schemas/user.js";

import ClientError from "../helpers/client_error.js";

const ACCESS_TOKEN_KEY = process.env.JWT_ACCESS_TOKEN_KEY;

// Token authentication middleware
export const authRoute = (req, res, next) => {
  const token = req.cookies[process.env.JWT_ACCESS_TOKEN_NAME];

  if (!token) {
    throw new ClientError("Access Denied. Request is malformed.", 401);
  }

  jwt.verify(token, ACCESS_TOKEN_KEY, (err, JWTdata) => {
    if (err) {
      throw new ClientError("Access Denied. Invalid credentials.", 401);
    }

    req.userID = JWTdata.userID;
    req.role = JWTdata.role;
  });

  next();
  return;
};

// Admin authorization middleware
export const adminRoute = (req, res, next) => {
  if (process.env.PROTECTED_ROUTES_DISSABLED == "true") {
    next();
    return;
  }

  if (req.role !== "admin") {
    throw new ClientError(
      "Access forbiden. You do not have permison to access this resource.",
      403
    );
  }

  next();
  return;
};
