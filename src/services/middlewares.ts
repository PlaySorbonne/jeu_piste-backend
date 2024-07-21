import { ZodEffects, ZodError, ZodSchema } from "zod";
import { cookiesGetLoggedUser } from "../utils";
import { HttpCodes } from "../utils/constants";
import { ResponseTyped, RequestWPrisma } from "../utils/types";
import type { Response, NextFunction } from "express";

// This is a middleware that checks if the user is logged in
// if the user is not logged in, it will return an error
// if idField is provided, it will check if the userID is the same as req.params[idField] (or an admin)
// if admin is true, it will only check if the user is an admin, this overrides id
export function requireAuth({
  idField,
  admin,
}: { idField?: string; admin?: boolean } = {}) {
  return async function (
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

    let user = await req.prisma!.user.findFirst({
      where: {
        name: loggedUserId,
      },
    });

    if (admin && (!user || user.isAdmin !== true)) {
      let code = HttpCodes.FORBIDDEN;
      res
        .status(code)
        .json({
          message: "You must be admin for this !",
          status: code,
          isError: true,
        })
        .end();
      return;
    }

    if (idField) {
      let id = req.params[idField];
      if (id && loggedUserId !== id && !user?.isAdmin) {
        let code = HttpCodes.FORBIDDEN;
        res
          .status(code)
          .json({
            message: "You are not allowed to do this !",
            status: code,
            isError: true,
          })
          .end();
        return;
      }
    }

    res.locals.loggedUserId = loggedUserId;
    res.locals.sessionId = req.cookies.session;
    res.locals.isAdmin = !!user?.isAdmin;

    next();
  };
}

// Supports zod treatment, transformed data can be found on res.locals.body.
// If the body is not valid, it will return an error
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
          message: "Wrong Body",
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

// Doesn't support zod treatment, only checks if params are valid
export function verifyParams(schema: ZodSchema) {
  return function (
    req: RequestWPrisma,
    res: ResponseTyped,
    next: NextFunction
  ) {
    let data = schema.safeParse(req.params);
    if (!data.success) {
      let code = HttpCodes.BAD_REQUEST;
      res
        .status(code)
        .json({
          status: code,
          isError: true,
          message: "Wrong Params",
          data: {
            zodParseSuccess: data.success,
            data: data.data,
            error: data.error,
          },
        })
        .end();
      return;
    }
    next();
  };
}
