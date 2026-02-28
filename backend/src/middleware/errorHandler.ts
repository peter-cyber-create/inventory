import { Request, Response, NextFunction } from "express";
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: Record<string, string>,
  ) {
    super(message);
    this.name = "AppError";
  }
}
export function errorHandler(err: Error | AppError, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const body: { error: string; details?: Record<string, string> } = {
    error: err.message || "Internal server error",
  };
  if (err instanceof AppError && err.details && Object.keys(err.details).length > 0) {
    body.details = err.details;
  }
  res.status(statusCode).json(body);
}
