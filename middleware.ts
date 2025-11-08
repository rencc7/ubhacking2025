import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Minimal middleware to allow Next.js middleware file to exist without JSX
export function middleware(request: NextRequest) {
  // You can add authentication or redirects here if needed.
  return NextResponse.next();
}

// Example matcher — adjust or remove as required by your app routing.
export const config = {
  matcher: "/(api|dashboard|_next)/:path*",
};