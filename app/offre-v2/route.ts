// Sert la proposition commerciale V2 (HTML standalone) sous l'URL /offre-v2.
// Next.js App Router intercepte les URLs avec extension .html dans public/sous-dossier,
// donc on passe par un Route Handler qui retourne le HTML brut en text/html.
// Build au build time (force-static) → CDN-cached, perf identique à un fichier static.

import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-static";

export function GET() {
  const html = readFileSync(
    join(process.cwd(), "offer/proposition-v2.html"),
    "utf8",
  );
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300, must-revalidate",
    },
  });
}
