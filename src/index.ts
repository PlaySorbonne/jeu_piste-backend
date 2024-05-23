import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from "express";
import dotenv from "dotenv";


dotenv.config();

const prisma = new PrismaClient()
const app = express()

const PORT = process.env.PORT;

app.use(express.json()) // for parsing application/json

// Attach Prisma to every request
app.use((req, res, next) => {
  req.prisma = prisma
  next()
})

app.get("/", (request: Request, response: Response) => {
  response.status(200).send("Hello World");
});

app.listen(PORT, () => {
  console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});

