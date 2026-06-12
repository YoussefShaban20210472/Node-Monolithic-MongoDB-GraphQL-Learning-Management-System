import { Request, Response } from "express";
import session from "express-session";

export type Context = {
  req: Request & {
    session: session.Session & {
      userId?: string;
      role?: string;
    };
  };
  res: Response;
};
