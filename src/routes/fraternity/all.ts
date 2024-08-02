import express from "express";
import { RequestWPrisma, ResponseTyped } from "../../utils/types";
import { HttpCodes } from "../../utils/constants";
import { requireAuth } from "../../services/middlewares";

const router = express.Router();

router.use(requireAuth({}));

router.get("/all", async (req: RequestWPrisma, res: ResponseTyped) => {
  let all = await req.prisma!.fraternity.findMany();

  let code = HttpCodes.OK;
  res.status(code).json({
    message: "all fraternities",
    status: code,
    isError: false,
    data: all,
  });
});

export default router;
