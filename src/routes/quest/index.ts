import express from "express";

import Create from "./create";

const router = express.Router();
router.use(Create);

router.get("/", (req, res) => {
  res.status(200).send("user");
});

export default router;
