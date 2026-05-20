import { NextResponse, type NextRequest } from "next/server";

/**
 * Protège /admin (rôle admin requis) et /mon-compte (membre connecté).
 * Lit le cookie `bads_session` posé par lib/auth.ts.
 *
 * Migration Firebase : remplacer la lecture du cookie par une vérification
 * du token ID Firebase (admin SDK) côté Route Handler, et stocker le token
 * en cookie httpOnly via /api/session.
 */

type Session = { uid: string; role: "member" | "admin"; email: string };

function readSession(req: NextRequest): Session | null {
  const raw = req.cookies.get("bads_session")?.value;
  if (!raw) return null;
  try { return JSON.parse(decodeURIComponent(raw)) as Session; } catch { return null; }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = readSession(req);

  const needsAdmin = pathname.startsWith("/admin");
  const needsMember = pathname.startsWith("/mon-compte");

  if (needsAdmin || needsMember) {
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/connexion";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (needsAdmin && session.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/mon-compte";
      url.searchParams.set("error", "admin-required");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/mon-compte/:path*"],
};
