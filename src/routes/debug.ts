import express from "express";

const router = express.Router();

router.get("/", (request, response) => {
  response.status(200).send("Hello World");
});

router.get("/error", (req, res) => {
    throw new Error();
})

export default router;