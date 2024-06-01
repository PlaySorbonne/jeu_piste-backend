import { PrismaClient } from '@prisma/client'
import type { ResquestWPrisma } from './utils/types';
import express, { Request, Response } from "express";
import dotenv from "dotenv";

import mainRoutes from "./routes"
import debugRoutes from "./routes/debug"
import userRoutes from "./routes/user"

dotenv.config();

const prisma = new PrismaClient()
const app = express()

const PORT = process.env.PORT;

// MODULES 
app.use(express.json()) // for parsing application/json

// Attach Prisma to every request
app.use((req: ResquestWPrisma, res, next) => {
  req.prisma = prisma
  next()
})

// ROUTES
app.use("/", mainRoutes)
app.use("/debug", debugRoutes)
app.use("/user", userRoutes)


// RUN
app.listen(PORT, () => {
  console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
  throw new Error(error.message);
});
