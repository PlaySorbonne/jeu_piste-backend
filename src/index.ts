import { PrismaClient } from "@prisma/client";
import type { ResponseTyped, RequestWPrisma } from "./utils/types";
import express, { Request, Response, ErrorRequestHandler } from "express";
import dotenv from "dotenv";

import mainRoutes from "./routes/main";
import debugRoutes from "./routes/debug";
import playerRoutes from './routes/player'
import { HttpCodes } from "./utils/constants";
import { ZodError } from "zod";
import cookieParser from "cookie-parser";
import multer from "multer";

dotenv.config();

const prisma = new PrismaClient();
const app = express();

const PORT = process.env.PORT;

// MODULES
app.use(express.json()); // for parsing application/json
app.use(cookieParser()); // for parsing cookies
app.use(multer().none()); // For parsing json body & multipart/form-data
// logging every request
app.use((req, res, next) => {
  console.log(
    `got ${req.method} request at ${req.originalUrl}`,
    "\n cookies : ",
    req.cookies,
    "\n body : ",
    req.body,
    "\n query :",
    req.query,
    "\n"
  );
  next();
});

// Attach Prisma to every request
app.use((req: RequestWPrisma, res, next) => {
  req.prisma = prisma;
  next();
});

// ROUTES
app.use("/", mainRoutes);
app.use("/debug", debugRoutes);
app.use("/player", playerRoutes);

// ERROR HANDLER
app.use(<ErrorRequestHandler>(
  function (err, req: RequestWPrisma, res: ResponseTyped, next) {
    let code =
      err instanceof ZodError
        ? HttpCodes.BAD_REQUEST
        : HttpCodes.INTERNAL_ERROR;

    res
      .status(code)
      .json({
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
      })
      .end();
    next(err);
  }
));

// RUN
app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
