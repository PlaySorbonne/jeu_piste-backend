import express from "express";

import All from "./all";
import Id from "./id";

const router = express.Router();

router.use(All);
router.use(Id);


router.get("/", (req, res) => {
  res.status(200).send("user");
});


router.post("/", (req, res) => {
  res.status(400).json({
    message: "use /api/register instead",
    status: 400,
    isError: true,
    data: null,
  });
});



export default router;
