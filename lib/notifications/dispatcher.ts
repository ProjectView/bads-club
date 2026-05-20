/**
 * Dispatcher de notifications.
 *
 * - En PROD : POST l'enveloppe vers le webhook N8N (`process.env.N8N_NOTIF_WEBHOOK`).
 *   N8N route ensuite vers email/SMS/Slack selon le type et le destinataire.
 *   Pas de retry côté app : N8N gère la file et les retries.
 *
 * - En DEV/MAQUETTE : on stocke en mémoire pour afficher dans l'UI (cloche membre
 *   + feed admin). Aucun appel réseau. C'est ce qui permet de démontrer le flow
 *   pendant le pitch.
 *
 * L'app n'envoie JAMAIS d'email/SMS directement — N8N est le single point of dispatch.
 */

import {
  envelopeId,
  nowIso,
  type NotificationData,
  type NotificationEnvelope,
  type NotificationEventType,
} from "./events";

export interface NotificationDispatcher {
  /** Émet un événement. La méthode ne throw jamais : un échec côté N8N
   *  ne doit pas faire échouer la résa. Les erreurs sont loggées. */
  emit<T extends NotificationEventType>(args: {
    type: T;
    audience: "member" | "admin";
    recipientId: string | null;
    data: NotificationData[T];
    links?: NotificationEnvelope["links"];
  }): Promise<void>;

  /** Lecture pour la UI (cloche membre / feed admin). */
  listForRecipient(recipientId: string, limit?: number): Promise<NotificationEnvelope[]>;
  listForAdmins(limit?: number): Promise<NotificationEnvelope[]>;

  markRead(envelopeId: string): Promise<void>;
  unreadCountForRecipient(recipientId: string): Promise<number>;
  unreadCountForAdmins(): Promise<number>;
}

// -----------------------------------------------------------------------------
// Impl in-memory (maquette)
// -----------------------------------------------------------------------------

type Stored = NotificationEnvelope & { read: boolean };

class InMemoryDispatcher implements NotificationDispatcher {
  private events: Stored[] = [];

  async emit<T extends NotificationEventType>(args: {
    type: T;
    audience: "member" | "admin";
    recipientId: string | null;
    data: NotificationData[T];
    links?: NotificationEnvelope["links"];
  }): Promise<void> {
    const env: Stored = {
      id: envelopeId(),
      type: args.type,
      occurredAt: nowIso(),
      audience: args.audience,
      recipientId: args.recipientId,
      data: args.data,
      links: args.links ?? {},
      read: false,
    };
    this.events.unshift(env);

    // En MAQUETTE : on broadcast l'event au reste de l'app via un CustomEvent.
    // Les composants Toast et NotifBell écoutent "bads-notification" pour réagir.
    // En PROD : la livraison passe par Cloud Functions FCM (server-side) + N8N (Brevo).
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("bads-notification", { detail: env }));
    }

    // En PROD : POST vers N8N. En DEV : on stocke uniquement.
    const url = process.env.N8N_NOTIF_WEBHOOK;
    if (url) {
      try {
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Bads-Source": "app" },
          body: JSON.stringify(env),
          // Pas de await sur la réponse pour ne pas bloquer la résa.
        }).catch(err => console.warn("[notif] N8N webhook failed", err));
      } catch (err) {
        console.warn("[notif] N8N webhook unreachable", err);
      }
    }
  }

  async listForRecipient(recipientId: string, limit = 20): Promise<NotificationEnvelope[]> {
    return this.events
      .filter(e => e.audience === "member" && e.recipientId === recipientId)
      .slice(0, limit);
  }

  async listForAdmins(limit = 50): Promise<NotificationEnvelope[]> {
    return this.events.filter(e => e.audience === "admin").slice(0, limit);
  }

  async markRead(envelopeId: string): Promise<void> {
    const e = this.events.find(x => x.id === envelopeId);
    if (e) e.read = true;
  }

  async unreadCountForRecipient(recipientId: string): Promise<number> {
    return this.events.filter(e => e.audience === "member" && e.recipientId === recipientId && !e.read).length;
  }

  async unreadCountForAdmins(): Promise<number> {
    return this.events.filter(e => e.audience === "admin" && !e.read).length;
  }
}

// Singleton module-level
const _global = globalThis as unknown as { __bads_notif?: NotificationDispatcher };
export const notifications: NotificationDispatcher =
  _global.__bads_notif ?? (_global.__bads_notif = new InMemoryDispatcher());

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

export function summarizeNotif(env: NotificationEnvelope): { title: string; body: string } {
  const d = env.data as Record<string, unknown>;
  const b = (d.booking ?? d.slot) as { sportLabel?: string; courtLabel?: string; startsAt?: string; zoneLabel?: string } | undefined;
  const by = d.bookedBy as { displayName?: string } | undefined;
  const cancelBy = d.cancelledBy as { displayName?: string } | undefined;
  const fmt = b?.startsAt ? new Date(b.startsAt).toLocaleString("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
  switch (env.type) {
    case "booking.confirmed":       return { title: "Réservation confirmée", body: `${b?.sportLabel} · ${b?.courtLabel} · ${fmt}` };
    case "booking.cancelled":       return { title: "Réservation annulée", body: `${b?.sportLabel} · ${b?.courtLabel} · ${fmt}` };
    case "booking.reminder_30min":  return { title: "Ta partie commence dans 30 min", body: `${b?.sportLabel} · ${b?.courtLabel}` };
    case "waitlist.slot_available": return { title: "Un créneau s'est libéré !", body: `${b?.sportLabel} · ${b?.courtLabel} · ${fmt} — confirme vite` };
    case "admin.booking_created":   return { title: "Nouvelle réservation", body: `${by?.displayName ?? "?"} · ${b?.sportLabel} ${b?.courtLabel} · ${fmt}` };
    case "admin.booking_cancelled": return { title: "Annulation", body: `${cancelBy?.displayName ?? "?"} · ${b?.sportLabel} ${b?.courtLabel} · ${fmt}` };
    default:                        return { title: "Bad's Club", body: "Nouvelle notification" };
  }
}
