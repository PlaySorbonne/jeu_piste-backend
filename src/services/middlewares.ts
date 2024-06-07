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

export function treatBody(schema: ZodSchema) {
  return function (
    req: RequestWPrisma,
    res: ResponseTyped,
    next: NextFunction
  ) {
    let data = schema.safeParse(req.body);
    if (!data.success) {
      let code = HttpCodes.BAD_REQUEST;
      res
        .status(code)
        .json({
          status: code,
          isError: true,
          message: "Wrong Input",
          data: {
            zodParseSuccess: data.success,
            data: data.data,
            error: data.error,
          },
        })
        .end();
      return;
    }
    res.locals.body = data.data;
    next();
  };
}
