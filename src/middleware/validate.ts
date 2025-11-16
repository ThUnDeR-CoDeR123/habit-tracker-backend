import { Request, Response, NextFunction } from "express";

type ValidatorFn = (body: any) => string[];

export const validate = (validator: ValidatorFn) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors = validator(req.body);
    if (errors && errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }
    next();
  };
};
