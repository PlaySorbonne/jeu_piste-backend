import { ZodEffects, ZodError, ZodSchema } from "zod";
import { cookiesGetLoggedUser } from "../utils";
import { HttpCodes } from "../utils/constants";
import { ResponseTyped, RequestWPrisma } from "../utils/types";
import type { Response, NextFunction } from "express";
import { z } from "zod";

export async function requireAuth(
  req: RequestWPrisma,
  res: ResponseTyped,
  next: NextFunction
) {
  let loggedUserId = await cookiesGetLoggedUser(req.cookies, req.prisma!);

  if (!loggedUserId) {
    let code = HttpCodes.UNAUTHORIZED;
    res
      .status(code)
      .json({
        message: "You must be logged in for this !",
        status: code,
        isError: true,
      })
      .end();
    return;
  }

  res.locals.loggedUserId = loggedUserId;
  res.locals.sessionId = req.cookies.session;

  next();
}

export function checkBody(schema: ZodSchema) {

  return function (
    req: RequestWPrisma,
    res: ResponseTyped,
    next: NextFunction
  ) {
    try {
      schema.parse(req.body);
    } catch (err: any) {
      let code = HttpCodes.BAD_REQUEST;

      res.status(code).json({
        isError: true,
        message: "Something went wrong :(",
        data: {
          name: err?.name,
          message: err?.message,
          stack: err?.stack,
          cause: err?.cause,
          error: err,
        },
        status: code,
      });
    }
  };
}
