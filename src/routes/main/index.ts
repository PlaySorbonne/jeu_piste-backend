import express from "express";
import login from "./login";
import logout from "./logout";
import register from "./register";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("index");
});

router.use(login);
router.use(logout);
router.use(register);

export default router;
