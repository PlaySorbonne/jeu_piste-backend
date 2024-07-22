import express from "express";
import { RequestWPrisma, ResponseTyped } from "../../utils/types";
import { Player, Prisma } from "@prisma/client";
import { HttpCodes, schemas } from "../../utils/constants";
import { z } from "zod";
import { verifyParams } from "../../services/middlewares";
import { zodOptionalEmpty } from "../../utils";

const router = express.Router();


let paramsSchema = z.object({
  name: schemas.name,
});

// Todo make function treat params or smth
router.get(
  "/:name",
  verifyParams(paramsSchema),
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
      return;
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

let bodySchema = z.object({
  displayName: zodOptionalEmpty(schemas.displayName),

});
  

router.put(
  "/:name",
  verifyParams(paramsSchema),
)

export default router;
