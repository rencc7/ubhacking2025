import { db } from "./db";
import { getSessionFromRequest } from "./auth";

export async function getCurrentUser() {
  const session = getSessionFromRequest();

  if (!session?.userId) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: {
      profile: true,
    },
  });

  return user;
}

