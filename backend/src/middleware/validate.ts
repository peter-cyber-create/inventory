import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";
import { AppError } from "./errorHandler.js";

type ReqSchema = z.ZodType<{ params?: unknown; query?: unknown; body?: unknown }>;

export function validate(schema: ReqSchema | { body?: ZodSchema; params?: ZodSchema; query?: ZodSchema }) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if ("body" in schema && schema.body) {
      try {
        if (schema.body) req.body = schema.body.parse(req.body);
        if (schema.params) req.params = schema.params.parse(req.params);
        if (schema.query) req.query = schema.query.parse(req.query);
        next();
      } catch (err: unknown) {
        const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Validation failed";
        next(new AppError(400, msg));
      }
      return;
    }
    const result = (schema as ReqSchema).safeParse({
      params: req.params,
      query: req.query,
      body: req.body,
    });
    if (!result.success) {
      const msg = result.error.errors.map((e) => e.path.join(".") + ": " + e.message).join("; ");
      next(new AppError(400, msg));
      return;
    }
    const data = result.data as { params?: Record<string, string>; query?: Record<string, string>; body?: unknown };
    if (data.params) req.params = data.params;
    if (data.query) req.query = data.query;
    if (data.body !== undefined) req.body = data.body;
    next();
  };
}
