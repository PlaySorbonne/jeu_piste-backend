import express from "express";
import { z } from "zod";
import { treatBody } from "../../services/middlewares";
import { HttpCodes, schemas, sessionTTL } from "../../utils/constants";
import { RequestWPrisma, ResponseTyped } from "../../utils/types";
import { generateSession, zodOptionalEmpty } from "../../utils";

const router = express.Router();

let bodySchema = z.object({
  name: z.union([schemas.name, schemas.mail]),
  password: zodOptionalEmpty(schemas.password),
});

type bodyType = z.infer<typeof bodySchema>;

router.get("/login", (req: RequestWPrisma, res) => {
  res.status(200).send(
    `<form action="/login" method="post" enctype="multipart/form-data">
        name or mail
        <input type="text" name="name" id="name">
        password
        <input type="text" name="password" id="password">
        <input type="submit" value="submit" name="submit">
      </form>`
  );
});

router.post(
  "/login",
  treatBody(bodySchema),
  async (req: RequestWPrisma<bodyType>, res: ResponseTyped<bodyType>) => {
    let isMail = res.locals.body.name.includes("@");

    let data: {
      password: string | undefined;
      mail?: string;
      name?: string;
    } = {
      password: res.locals.body.password,
      [isMail ? "mail" : "name"]: res.locals.body.name,
    };

    let user = await req.prisma!.user.findMany({
      where: data,
    });

    if (!user[0]) {
      let code = HttpCodes.BAD_REQUEST;
      res
        .status(code)
        .json({
          message: "Wrong username or password",
          status: code,
          isError: true,
          data: {
            name: res.locals.body.name,
          },
        })
        .end();
      return;
    }

    let userId = user[0].name;

    let session = await req.prisma!.session.create({
      data: {
        userId,
        id: generateSession(userId),
        expires:
          sessionTTL === -1
            ? new Date(2147483647000)
            : new Date(Date.now() + sessionTTL),
      },
    });

    let code = HttpCodes.OK;
    res
      .cookie("session", session.id, {
        expires:
          sessionTTL === -1
            ? new Date(2147483647000)
            : new Date(Date.now() + sessionTTL - 60 * 1000),
      })
      .status(code)
      .json({
        message: "",
        status: code,
        isError: false,
        data: session,
      });
  }
);

export default router;
