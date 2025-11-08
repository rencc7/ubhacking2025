import { handleAuth, handleLogin, handleLogout, handleCallback } from "@auth0/nextjs-auth0";
import { db } from "@/lib/db";

export const GET = handleAuth({
  login: handleLogin({
    returnTo: "/dashboard",
  }),
  logout: handleLogout({
    returnTo: "/",
  }),
  callback: handleCallback({
    afterCallback: async (req, res, session) => {
      if (session?.user) {
        // Create or update user in database
        const auth0Id = session.user.sub;
        const email = session.user.email || "";
        const name = session.user.name || session.user.nickname || null;

        try {
          await db.user.upsert({
            where: { auth0Id },
            update: {
              email,
              name,
            },
            create: {
              auth0Id,
              email,
              name,
            },
          });
        } catch (error) {
          console.error("Error creating/updating user:", error);
        }
      }
      return session;
    },
  }),
});

