import { BaseError } from "./base-error";

export class BadRequestError extends BaseError {
  constructor(message: string = "") {
    super(400, "Bad Request" + (message ? `: ${message}` : ""));
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string = "") {
    super(404, "Not Found" + (message ? `: ${message}` : ""));
  }
}