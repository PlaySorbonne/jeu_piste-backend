import express from "express";
import { RequestWPrisma, ResponseTyped } from "../../utils/types";
import { Player, Prisma } from "@prisma/client";
import { HttpCodes } from "../../utils/constants";

const router = express.Router();

router.get(
  "/:name",
  async (req: RequestWPrisma<any, { name: string }>, res: ResponseTyped<Player>) => {
    
    let [player, ..._] = await req.prisma!.player.findMany({
      where: {
        name: req.params.name,
      }
    })
    
    if (!player) {
      let code = HttpCodes.NOT_FOUND;
      
      res.status(code).json({
        status: code,
        isError: true,
        message: `player ${req.params.name} not found`,
      })
    }
    
    let code = HttpCodes.OK;
    res.status(code).json({
      isError: false,
      status: code,
      message: `Information of player ${req.params.name}`,
      data: player
    });
  }
);

export default router;
