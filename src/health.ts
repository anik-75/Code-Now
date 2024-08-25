import { Request,Response } from "express";

export function health(_req: Request, res:Response)  {
  res.send("Server is healthy")
  return;
}