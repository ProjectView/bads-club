/**
 * Endpoint catch-all qui forward un événement vers N8N.
 *
 * Pourquoi cet endpoint existe ? Pour découpler totalement l'app de N8N :
 *  - on peut pointer N8N_NOTIF_WEBHOOK ailleurs (Make, Zapier, server interne)
 *    sans toucher au code
 *  - on peut signer le payload côté serveur (HMAC) avec un secret partagé
 *  - on peut activer/désactiver les notifications par feature flag
 *
 * Le service.ts du booking n'appelle PAS cette route directement — il utilise
 * `notifications.emit()` qui en mode prod fait l'appel HTTP via fetch.
 * Cette route est exposée pour permettre à des tiers (ex. job de rappel 30 min
 * hébergé sur Cloud Functions) de pousser des events sans dupliquer la logique.
 */

import { NextResponse } from "next/server";
import { notifications } from "@/lib/notifications/dispatcher";
import type { NotificationEventType, NotificationData } from "@/lib/notifications/events";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  const env = body as {
    type?: NotificationEventType;
    audience?: "member" | "admin";
    recipientId?: string | null;
    data?: NotificationData[NotificationEventType];
    links?: { primary?: string; secondary?: string };
  };

  if (!env.type || !env.audience || !env.data) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  await notifications.emit({
    type: env.type,
    audience: env.audience,
    recipientId: env.recipientId ?? null,
    data: env.data,
    links: env.links,
  });

  return NextResponse.json({ ok: true });
}
