import express from "express";

import All from "./all";

const router = express.Router();

router.use(All);

router.get("/", (req, res) => {
  res.status(200).send("fraternité");
});

export default router;
