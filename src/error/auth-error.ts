import { BaseError } from "./base-error";

export class LoginError extends BaseError {
  constructor() {
    super(400, "Invalid username or password");
  }
}

export class RegisterError extends BaseError {
  constructor() {
    super(400, "Username or email already exists");
  }
}

export class UnauthenticatedError extends BaseError {
  constructor() {
    super(401, "Unauthenticated");
  }
}
