import express from "express";

import Create from "./create";
import All from "./all";

const router = express.Router();
router.use(Create);
router.use(All);

router.get("/", (req, res) => {
  res.status(200).send("user");
});

export default router;
