import { PrismaClient } from "@prisma/client";
import { ZodSchema, z } from "zod";
import { randomBytes } from "crypto";

// Returns undefined if nothing
export async function cookiesGetLoggedUser(cookies: any, prisma: PrismaClient) {
  let session = cookies?.session;

  if (!session || typeof session !== "string") {
    console.log("no valid session");
    return undefined;
  }

  // findMany so no error when empty
  let sessionRows = await prisma.session.findMany({
    where: {
      id: session,
    },
  });

  if (!sessionRows[0]) return undefined;

  // TODO maybe delete row ?
  if (sessionRows[0].expires < new Date()) {
    console.log("session expired");
    return undefined;
  }

  return sessionRows[0]?.userId;
}

export function zodOptionalEmpty(schema: ZodSchema) {
  return z
    .union([schema, z.literal("")])
    .transform((e) => (e === "" ? undefined : e));
}

// 4 first characters are random, 11 next characters are the date it was generated, last characters are the user id in hex
export function generateSession(id: string) {
  return `${randomBytes(2)
    .toString("hex")
    .padStart(5, "0")}${Date.now().toString(16)}${id
    .split("")
    .map((c) => c.charCodeAt(0).toString(16))
    .join("")}`;
}
