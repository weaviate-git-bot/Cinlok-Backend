import type { Request, Response, NextFunction } from "express";

/*
This library is created because express can't catch async error.
These function wrap the async function and catch the error.
*/

const AsyncRoute = (fn: (req: Request, res: Response) => void) => {
  return function asyncUtilWrap(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const fnReturn = fn(req, res);
    return Promise.resolve(fnReturn).catch(next);
  };
};

const AsyncMiddleware = (
  fn: (req: Request, res: Response, next: NextFunction) => void
) => {
  return function asyncUtilWrap(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const fnReturn = fn(req, res, next);
    return Promise.resolve(fnReturn).catch(next);
  };
};

export { AsyncRoute, AsyncMiddleware };
