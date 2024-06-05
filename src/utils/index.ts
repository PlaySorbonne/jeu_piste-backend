import { PrismaClient } from "@prisma/client";

// Returns undefined if nothing
export async function cookiesGetLoggedUser(cookies: any, prisma: PrismaClient) {
  let session = cookies?.session;

  if (!session || typeof session !== "string") {
    console.log("no valid session")
    return undefined;
  };

  // findMany so no error when empty
  let sessionRows = await prisma.session.findMany({
    where: {
      id: session,
    },
  });
  
  if (!sessionRows[0])
    return undefined

  // TODO maybe delete row ?
  if (sessionRows[0].expires < new Date()) {
    console.log("session expired")
    return undefined;
  }

  return sessionRows[0]?.userId;
}
