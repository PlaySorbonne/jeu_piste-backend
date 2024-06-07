import express from "express";
import { requireAuth } from "../../services/middlewares";
import { HttpCodes } from "../../utils/constants";
import { RequestWPrisma, ResponseTypedWAuth } from "../../utils/types";

const router = express.Router();

// LOGOUT
router.get("/logout", (req, res) => {
  res.status(200).send(
    `<form action="/logout" method="post" enctype="multipart/form-data">
        <input type="submit" value="logout" name="submit">
      </form>`
  );
});

router.post("/logout", async (req: RequestWPrisma, res: ResponseTypedWAuth, next) => {
  let sessionId = req.cookies.session;
  if (!sessionId || typeof sessionId !== "string") {
    let code = HttpCodes.BAD_REQUEST;
    res
      .cookie("session", "delete", {
        expires: new Date(0),
      })
      .json({
        isError: true,
        message: "No Valid session",
        status: code,
      });
      return;
  }

  let {count} = await req.prisma!.session.deleteMany({
    where: {
      id: sessionId,
    },
  });

  if (count === 0) console.warn("Session", sessionId, "doesn't exist ?");

  let code = HttpCodes.OK;
  res
    .cookie("session", "delete", {
      expires: new Date(0),
    })
    .status(code)
    .json({
      message: count > 0 ? "Ok !" : "Session not found, asking to clear cookies",
      isError: false,
      status: code,
      data: {
        sessionId: sessionId,
      },
    });
});

export default router;
