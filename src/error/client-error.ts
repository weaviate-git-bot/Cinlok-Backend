import { BaseError } from "./base-error";

export class BadRequestError extends BaseError {
  constructor(message = "") {
    super(400, "Bad Request" + (message ? `: ${message}` : ""));
  }
}

export class NotFoundError extends BaseError {
  constructor(message = "") {
    super(404, "Not Found" + (message ? `: ${message}` : ""));
  }
}

export class ForbiddenError extends BaseError {
  constructor(message = "") {
    super(403, "Forbidden" + (message ? `: ${message}` : ""));
  }
}
