import type { NextFunction, Request, Response } from "express";

const Serializer = (_: Request, res: Response, next: NextFunction) => {
  res.json = ((data: any) => {
    res.setHeader("Content-Type", "application/json");
    if (data instanceof Object && !(data instanceof Array)) {
      const { message, isError, ...rest } = data
      res.send(JSON.stringify({
        isError: isError || false,
        message: message || (isError ? "Failed" : "Success"),
        data: rest
      }));
    } else {
      res.send(JSON.stringify({
        isError: false,
        message: "Success",
        data,
      }));
    }
  }) as any;
  next();
};

export default Serializer