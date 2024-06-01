import express from "express";

const router = express.Router();

router.get("/login", (req, res) => {
    res.status(200).send("login")
})

router.get("/register", (req, res) => {
    res.status(200).send("register")
})

export default router;