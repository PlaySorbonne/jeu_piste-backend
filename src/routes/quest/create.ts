import express from "express";
import { RequestWPrisma, ResponseTyped } from "../../utils/types";
import { HttpCodes, schemas } from "../../utils/constants";
import { requireAuth, treatBody } from "../../services/middlewares";
import { z } from "zod";
import { zodOptionalEmpty } from "../../utils";

const router = express.Router();

let bodySchema = z.object({
  title: schemas.title,
  description: schemas.description,
  img: zodOptionalEmpty(schemas.img),
  lore: schemas.description,
  global: z.boolean(),
  points: schemas.score,
  starts: schemas.date,
  ends: schemas.date,
});

type bodyType = z.infer<typeof bodySchema>;

router.post(
  "/",
  requireAuth({ admin: true }),
  treatBody(bodySchema),
  async (req: RequestWPrisma<bodyType>, res: ResponseTyped<bodyType>) => {
    let quest = await req.prisma!.quest.create({
      data: {
        title: res.locals.body.title,
        img: res.locals.body.img,
        description: res.locals.body.description,
        lore: res.locals.body.lore,
        global: res.locals.body.global,
        points: res.locals.body.points,
        starts: res.locals.body.starts,
        ends: res.locals.body.ends,
      },
    });

    res.status(200).json({
      isError: false,
      data: quest,
      message: "Created !",
      status: 200,
    });
  },
);

export default router;
