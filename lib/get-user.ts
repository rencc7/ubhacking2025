import { getSession } from "@auth0/nextjs-auth0";
import { db } from "./db";

export async function getCurrentUser() {
  const session = await getSession();
  
  if (!session?.user) {
    return null;
  }

  const auth0Id = session.user.sub;
  
  const user = await db.user.findUnique({
    where: { auth0Id },
    include: {
      profile: true,
    },
  });

  return user;
}

