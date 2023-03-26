import type { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { ZodError, ZodIssue } from "zod";
import { BaseError } from "../error";

const ErrorHandler: ErrorRequestHandler = (
  err: any,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }
  console.log(err)
  if (err instanceof ZodError) {
    res.status(400).json({
      isError: true,
      message: err.errors
        .map((err: ZodIssue) => {
          return `${err.path} is ${err.message}`;
        })
        .join(", "),
    });
  } else if (err instanceof BaseError) {
    res.status(err.httpCode).json({
      isError: true,
      message: err.description,
    });
  } else {
    res.status(500).json({
      isError: true,
      message: "Internal Server Error : " + err.message,
    });
  }
};

export default ErrorHandler;
