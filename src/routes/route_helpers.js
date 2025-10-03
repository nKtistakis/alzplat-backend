import { authRoute, adminRoute } from "../auth/middleware.js";
import express from "express";
import query from "../database/query.js";
import patch from "../database/patch.js";

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // Catch errors and pass them to next
  };
};

class Response {
  constructor(data) {
    return { success: true, data: data };
  }
}

const errorHandlerMiddleware = (err, res) => {
  // Log errors for debugging
  if (err.name === "ClientError") {
    console.error(
      "User Error occurred:\n" +
        err.message +
        "\n\nOccurred at " +
        new Date().toISOString()
    );
  } else {
    console.error(err.stack + "\n\nOccurred at " + new Date().toISOString());
  }

  let errorMessage = err.message;

  // Check for specific error types
  if (
    !(
      err.name === "Error" ||
      err.name === "SyntaxError" ||
      err.name === "ClientError" ||
      err.name === "ValidationError"
    )
  ) {
    errorMessage = "Internal Server Error.";
    res.status(500);
  }

  res.status(err.status ?? 400).json({
    success: false,
    data: errorMessage,
  });
};

export {
  authRoute,
  adminRoute,
  errorHandlerMiddleware,
  catchAsync,
  Response,
  express,
  query,
  patch,
};
