import express from "express";

import All from "./all"
import Id from "./id"

const router = express.Router();

router.use(All)
router.use(Id)

router.get("/", (req, res) => {
  res.status(200).send("player");
});


export default router;
