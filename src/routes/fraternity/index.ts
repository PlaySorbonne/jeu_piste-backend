import express from "express";

import All from "./all";
import Modify from "./modify";

const router = express.Router();

router.use(All);
router.use(Modify);

router.get("/", (req, res) => {
  res.status(200).send("fraternité");
});

export default router;
