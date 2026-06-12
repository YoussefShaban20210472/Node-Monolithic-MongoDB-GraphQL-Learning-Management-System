import express, { Request, Response, NextFunction } from "express";
export default function errorAppHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(error);
  res.status(400).json({ errors: { message: "Hello" } });
}
