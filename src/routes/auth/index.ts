import express from "express";
import discord from "./discord";

const router = express.Router();

router.get("/", (req, res) => {
	res.status(200).send("auth");
});

router.use(discord);

export default router;
