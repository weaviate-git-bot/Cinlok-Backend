export class BaseError extends Error {
  public readonly httpCode: number;
  public readonly description: string;

  constructor(httpCode: number, description: string) {
    super();
    this.httpCode = httpCode;
    this.description = description;
  }
}
