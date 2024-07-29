import express from "express";

import Create from "./create";
import All from "./all";
import Id from "./id";

const router = express.Router();
router.use(Create);
router.use(All);
router.use(Id)

router.get("/", (req, res) => {
  res.status(200).send("user");
});

export default router;
