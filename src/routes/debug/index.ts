import express from "express";

const router = express.Router();

router.get("/", (request, response) => {
  response.status(200).send("Hello World");
});

router.get("/error", () => {
  throw new Error("uwu");
});

export default router;
