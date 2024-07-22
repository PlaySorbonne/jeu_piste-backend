import express from "express";
import { requireAuth } from "../../services/middlewares";


const router = express.Router();

router.use(requireAuth({admin:true}))

router.get("/", (req, res) => {
  res.status(200).send("admin");
});


export default router;
