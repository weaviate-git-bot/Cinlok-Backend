import { BaseError } from "./base-error";

export class LoginError extends BaseError {
  constructor() {
    super(400, "Invalid username or password");
  }
}

export class UnauthenticatedError extends BaseError {
  constructor() {
    super(401, "Unauthenticated");
  }
}
