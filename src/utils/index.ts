import { PrismaClient } from "@prisma/client";

// Returns undefined if nothing
export async function cookiesGetLoggedUser(cookies: any, prisma: PrismaClient) {
  let session = cookies.session;

  if (!session || typeof session !== "string") return undefined;

  let sessionRows = await prisma.session.findMany({
    where: {
      id: session,
    },
  });

  // TODO maybe delete row ?
  if (sessionRows[0].expires < new Date()) return undefined;

  return sessionRows[0].userId;
}
