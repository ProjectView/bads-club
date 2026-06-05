"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-context";
import { Modal } from "@/components/modal";
import { notifications } from "@/lib/notifications/dispatcher";

type EventInfo = {
  id: string;
  title: string;
  date: string;
  place: string;
  price: number;
  capacity: number;
  enrolled: number;
};

export function EventRegistration({ event }: { event: EventInfo }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [seats, setSeats] = useState(1);

  async function confirmRegistration() {
    if (!user) return;
    setRegistering(true);
    // Notif membre + admin
    await notifications.emit({
      type: "booking.confirmed",
      audience: "member",
      recipientId: user.uid,
      data: {
        booking: {
          bookingId: `evt_${event.id}_${user.uid}`,
          courtId: event.id.toUpperCase(),
          courtLabel: event.title,
          sportId: "badminton",
          sportLabel: event.title,
          zone: null,
          zoneLabel: null,
          startsAt: new Date().toISOString(),
          endsAt: new Date().toISOString(),
          priceCents: event.price * seats * 100,
        },
        recipient: { uid: user.uid, displayName: user.displayName, email: user.email, phone: user.phone },
        paymentIntentId: `pi_evt_${Date.now()}`,
      },
      links: { primary: "/mon-compte#reservations" },
    });
    await notifications.emit({
      type: "admin.booking_created",
      audience: "admin",
      recipientId: null,
      data: {
        booking: {
          bookingId: `evt_${event.id}_${user.uid}`,
          courtId: event.id.toUpperCase(),
          courtLabel: event.title,
          sportId: "badminton",
          sportLabel: `Évènement · ${event.title}`,
          zone: null,
          zoneLabel: null,
          startsAt: new Date().toISOString(),
          endsAt: new Date().toISOString(),
          priceCents: event.price * seats * 100,
        },
        bookedBy: { uid: user.uid, displayName: user.displayName, email: user.email, phone: user.phone },
      },
      links: { primary: "/admin/notifications" },
    });
    setRegistering(false);
    setDone(true);
    setOpen(false);
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-[var(--color-lime)]/40 bg-[var(--color-lime)]/5 p-5 text-center">
        <div className="font-display text-3xl text-[var(--color-lime)]">✓ Inscription confirmée</div>
        <p className="text-sm text-[var(--color-cream-dim)] mt-2">
          Tu as réservé {seats} place{seats > 1 ? "s" : ""} pour <b>{event.title}</b>.
          Tu reçois un email de confirmation et un rappel push la veille au soir.
        </p>
        <Link href="/mon-compte#reservations" className="font-mono text-xs text-[var(--color-lime)] underline mt-3 inline-block">
          Voir mes réservations →
        </Link>
      </div>
    );
  }

  return (
    <>
      {!user ? (
        <Link href={`/connexion?next=/evenements/${event.id}`} className="btn-lime w-full py-3.5 rounded-full font-medium block text-center">
          Se connecter pour s&apos;inscrire →
        </Link>
      ) : (
        <button onClick={() => setOpen(true)} className="btn-lime w-full py-3.5 rounded-full font-medium">
          Réserver ma place →
        </button>
      )}
      <button className="btn-ghost w-full mt-2 py-3 rounded-full text-sm">
        Inviter un partenaire
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={<>Confirmer ton inscription</>}
        actions={
          <>
            <button onClick={() => setOpen(false)} className="px-5 py-2 rounded-full text-sm hover:bg-white/5 text-[var(--color-muted)]">
              Annuler
            </button>
            <button onClick={confirmRegistration} disabled={registering}
              className="btn-lime px-5 py-2 rounded-full text-sm font-medium disabled:opacity-60">
              {registering ? "Confirmation…" : `Payer ${event.price * seats} €`}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <div className="font-display text-2xl text-[var(--color-cream)]">{event.title}</div>
            <div className="font-mono text-xs text-[var(--color-muted)] mt-1">{event.date} · {event.place}</div>
          </div>

          <div className="rounded-xl bg-white/[0.03] p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-2">Nombre de places</div>
            <div className="flex items-center gap-3">
              <button onClick={() => setSeats(Math.max(1, seats - 1))} disabled={seats <= 1}
                className="w-8 h-8 rounded-full border border-white/10 hover:border-[var(--color-lime)] grid place-items-center disabled:opacity-30">−</button>
              <span className="font-display text-2xl w-10 text-center">{seats}</span>
              <button onClick={() => setSeats(Math.min(4, seats + 1))} disabled={seats >= 4}
                className="w-8 h-8 rounded-full border border-white/10 hover:border-[var(--color-lime)] grid place-items-center disabled:opacity-30">+</button>
              <span className="text-xs text-[var(--color-muted)] ml-2">max 4 par compte</span>
            </div>
          </div>

          <div className="text-sm space-y-1 border-t border-white/10 pt-4">
            <div className="flex justify-between">
              <span className="text-[var(--color-cream-dim)]">Participation × {seats}</span>
              <span>{(event.price * seats).toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-[var(--color-cream-dim)]">
              <span>Frais de service</span>
              <span>0,00 €</span>
            </div>
            <div className="flex justify-between font-display text-2xl pt-2 border-t border-white/10 mt-2">
              <span>Total</span>
              <span className="text-[var(--color-lime)]">{(event.price * seats).toFixed(2)} €</span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-[var(--color-muted)] text-center">
            Stripe · CB, Apple Pay, Google Pay · annulation gratuite jusqu&apos;à 24h avant
          </div>
        </div>
      </Modal>
    </>
  );
}
