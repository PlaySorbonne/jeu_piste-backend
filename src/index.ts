import { PrismaClient } from "@prisma/client";
import type { ResponseTyped, RequestWPrisma } from "./utils/types";
import express, { Request, Response, ErrorRequestHandler } from "express";
import dotenv from "dotenv";

import mainRoutes from "./routes/main";
import debugRoutes from "./routes/debug";
import userRoutes from "./routes/user";
import { HttpCodes } from "./utils/constants";
import { ZodError } from "zod";

dotenv.config();

const prisma = new PrismaClient();
const app = express();

const PORT = process.env.PORT;

// MODULES
app.use(express.json()); // for parsing application/json

// Attach Prisma to every request
app.use((req: RequestWPrisma, res, next) => {
  req.prisma = prisma;
  next();
});

// ROUTES
app.use("/", mainRoutes);
app.use("/debug", debugRoutes);
app.use("/user", userRoutes);

// ERROR HANDLER
app.use(<ErrorRequestHandler>(
  function (err, req: RequestWPrisma, res: ResponseTyped, next) {
    console.error(err.stack);

    let code =
      err instanceof ZodError
        ? HttpCodes.BAD_REQUEST
        : HttpCodes.INTERNAL_ERROR;

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
));

// RUN
app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
