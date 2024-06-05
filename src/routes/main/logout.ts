import express from "express";
import { requireAuth } from "../../services/middlewares";
import { HttpCodes } from "../../utils/constants";
import { RequestWPrisma, ResponseTypedWAuth } from "../../utils/types";

const router = express.Router();

// LOGOUT
router.get("/logout", requireAuth, (req, res) => {
  res.status(200).send("logout");
});

router.post(
  "/logout",
  requireAuth,
  async (req: RequestWPrisma, res: ResponseTypedWAuth) => {
    let deleted = await req.prisma!.session.delete({
      where: {
        id: res.locals.sessionId,
      },
    });

    // Something weird's going on ?
    if (deleted.userId !== res.locals.loggedUserId)
      console.warn(
        `<!> got userID ${res.locals.loggedUserId} before, but deleting session with userID ${deleted.userId}`
      );

    let code = HttpCodes.OK;
    res.status(code).json({
      message: "Ok !",
      isError: false,
      status: code,
      data: undefined,
    });
  }
);

export default router;
