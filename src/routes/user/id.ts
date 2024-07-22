import express from "express";
import { RequestWPrisma, ResponseTyped } from "../../utils/types";
import { Player } from "@prisma/client";
import { HttpCodes, schemas } from "../../utils/constants";
import { requireAuth, verifyParams } from "../../services/middlewares";
import { z } from "zod";

let paramsSchema = z.object({
  name: schemas.name,
});

const router = express.Router();

// Todo make function treat params or smth
router.get(
  "/:name",
  verifyParams(paramsSchema),
  requireAuth({ idField: "name" }),
  async (
    req: RequestWPrisma<any, { name: string }>,
    res: ResponseTyped<Player>
  ) => {
    let [user, ..._] = await req.prisma!.user.findMany({
      where: {
        name: req.params.name,
      },
    });

    if (!user) {
      let code = HttpCodes.NOT_FOUND;

      res.status(code).json({
        status: code,
        isError: true,
        message: `user ${req.params.name} not found`,
      });
      return;
    }

    let code = HttpCodes.OK;
    res.status(code).json({
      isError: false,
      status: code,
      message: `Information of user ${req.params.name}`,
      data: user,
    });
  }
);

export default router;
