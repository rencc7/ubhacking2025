import { auth0 } from "@/lib/auth0";
import { db } from "@/lib/db";

// Simple router to delegate auth actions to the Auth0 client instance.
// This endpoint is mounted at /api/auth/[...auth0]
export async function GET(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname; // e.g. /api/auth/login

  if (pathname.endsWith("/login")) {
    // Use the server client's interactive login helper (newer SDK API)
    if (typeof (auth0 as any).startInteractiveLogin === "function") {
      return await (auth0 as any).startInteractiveLogin({ returnTo: "/dashboard" });
    }

    return new Response("Auth client missing startInteractiveLogin - check @auth0/nextjs-auth0 version and env", { status: 500 });
  }

  if (pathname.endsWith("/logout")) {
    // The SDK exposes a logout handler on the server client; pass the request so cookies/sessions can be read
    if (typeof (auth0 as any).handleLogout === "function") {
      return await (auth0 as any).handleLogout(req as any);
    }

    return new Response("Auth client missing handleLogout - check @auth0/nextjs-auth0 version and env", { status: 500 });
  }

  if (pathname.endsWith("/callback")) {
    // Newer server client may not expose handleCallback directly; if present, use it and preserve afterCallback behaviour
    if (typeof (auth0 as any).handleCallback === "function") {
      return await (auth0 as any).handleCallback(req as any, {
        afterCallback: async (_req: any, _res: any, session: any) => {
          if (session?.user) {
            const auth0Id = session.user.sub;
            const email = session.user.email || "";
            const name = session.user.name || session.user.nickname || null;

            try {
              await db.user.upsert({
                where: { auth0Id },
                update: { email, name },
                create: { auth0Id, email, name },
              });
            } catch (error) {
              console.error("Error creating/updating user:", error);
            }
          }
          return session;
        },
      } as any);
    }

    // If the SDK doesn't provide a high-level callback handler, return a helpful error so we can iterate
    return new Response("Auth callback handler not available on Auth0Client instance - check SDK docs and env vars", { status: 501 });
  }

  // default: delegate to profile/access-token/backchannel handlers if needed
  // fallback: return 404
  return new Response("Not Found", { status: 404 });
}

