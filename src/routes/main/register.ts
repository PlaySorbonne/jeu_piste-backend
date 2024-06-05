import { z } from "zod";
import { checkBody } from "../../services/middlewares";
import { schemas } from "../../utils/constants";
import { RequestWPrisma, ResponseTyped } from "../../utils/types";
import express from "express";

const router = express.Router();

let bodySchema = z.union([
  z.object({
    name: schemas.name,
    password: z.optional(schemas.password),
    mail: z.optional(schemas.mail),
  }),
  z.object({
    name: schemas.name,
  }),
]);

type bodyType = z.infer<typeof bodySchema>;

// REGISTER
router.get("/register", (req, res) => {
  res.status(200).send("register");
});

router.post(
  "/register",
  checkBody(bodySchema),
  (req: RequestWPrisma<bodyType>, res: ResponseTyped) => {
    req.prisma!.user.create({
      data: {
        name: req.body.name,
      },
    });
  }
);

export default router;
