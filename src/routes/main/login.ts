import express from "express";
import { z } from "zod";
import { checkBody } from "../../services/middlewares";
import { schemas } from "../../utils/constants";
import { RequestWPrisma, ResponseTyped } from "../../utils/types";

const router = express.Router();

let bodySchema = z.object({
  name: z.union([schemas.name, schemas.mail]),
  password: z.optional(schemas.password),
});

type bodyType = z.infer<typeof bodySchema>;

router.get("/login", (req: RequestWPrisma, res) => {
  res.status(200).send("login");
});

router.post("/login", checkBody(bodySchema)),
  (req: RequestWPrisma<bodyType>, res: ResponseTyped) => {
    res.status(200).json({
      message: "",
      status: 200,
      isError: false,
      data: {
        djiaozjdioa: "",
      },
    });
  };
  
export default router;
