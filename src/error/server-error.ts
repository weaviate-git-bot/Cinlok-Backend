import { BaseError } from "./base-error";

export class InternalServerError extends BaseError {
    constructor(message: string) {
        super(500, message ? "Internal Server Error: " + message : "Internal Server Error");
    }
}

