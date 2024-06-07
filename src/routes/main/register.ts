import { z } from "zod";
import { treatBody } from "../../services/middlewares";
import { HttpCodes, schemas } from "../../utils/constants";
import { RequestWPrisma, ResponseTyped } from "../../utils/types";
import express from "express";
import { zodOptionalEmpty } from "../../utils";

const router = express.Router();

let bodySchema = z.object({
  name: schemas.name,
  password: zodOptionalEmpty(schemas.password),
  mail: zodOptionalEmpty(schemas.mail),
});

type bodyType = z.infer<typeof bodySchema>;

// REGISTER
router.get("/register", (req, res) => {
  res.status(200).send(
    `<form action="/register" method="post" enctype="multipart/form-data">
        name
        <input type="text" name="name" id="name">
        mail
        <input type="text" name="mail" id="mail">
        password
        <input type="text" name="password" id="password">
        <input type="submit" value="submit" name="submit">
      </form>`
  );
});

router.post(
  "/register",
  treatBody(bodySchema),
  async (req: RequestWPrisma<bodyType>, res: ResponseTyped<bodyType>) => {
    let olds = await req.prisma!.user.findMany({
      where: {
        name: res.locals.body.name,
      },
    });

    if (olds[0]) {
      let code = HttpCodes.BAD_REQUEST;
      res
        .status(code)
        .json({
          isError: true,
          message: "User with this username already exists",
          status: code,
          data: {
            name: res.locals.body.name,
          },
        })
        .end();
      return;
    }

    let user = await req.prisma!.user.create({
      data: {
        name: res.locals.body.name,
        email: res.locals.body.mail,
        password: res.locals.body.password,
      },
    });

    let player = await req.prisma!.player.create({
      data: {
        name: res.locals.body.name,
      },
    });

    res.status(200).json({
      isError: false,
      data: user,
      message: "Created !",
      status: 200,
    });
  }
);

export default router;
