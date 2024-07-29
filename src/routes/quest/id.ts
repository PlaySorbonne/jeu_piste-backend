import express from "express";
import { RequestWPrisma, ResponseTyped } from "../../utils/types";
import { Quest } from "@prisma/client";
import { HttpCodes, schemas } from "../../utils/constants";
import { requireAuth, verifyParams } from "../../services/middlewares";
import { z } from "zod";

let paramsSchema = z.object({
  id: schemas.id,
});

const router = express.Router();

router.get(
  "/:id",
  verifyParams(paramsSchema),
  requireAuth({ idField: "name" }),
  async (
    req: RequestWPrisma<any, { id: string }>,
    res: ResponseTyped<Quest>
  ) => {
    let [quest, ..._] = await req.prisma!.quest.findMany({
      where: {
        // TODO : do the parseInt with zod
        id: parseInt(req.params.id),
      },
    });

    if (!quest) {
      let code = HttpCodes.NOT_FOUND;

      res.status(code).json({
        status: code,
        isError: true,
        message: `quest ${req.params.id} not found`,
      });
      return;
    }

    let code = HttpCodes.OK;
    res.status(code).json({
      isError: false,
      status: code,
      message: `Information of quest ${req.params.id}`,
      data: quest,
    });
  }
);

export default router;
