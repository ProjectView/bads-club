"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import { NotifPreferences } from "@/components/notif-preferences";

export default function MonComptePage() {
  return (
    <Suspense fallback={null}>
      <Account />
    </Suspense>
  );
}

function Account() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const welcome = params.get("welcome") === "1";
  const error = params.get("error");

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-6 text-center">
        <p className="text-[var(--color-muted)] mb-6">Chargement de ton compte…</p>
      </div>
    );
  }

  async function onLogout() {
    await signOut();
    router.push("/");
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
      {welcome && (
        <div className="mb-8 border border-[var(--color-lime)]/40 bg-[var(--color-lime)]/5 rounded-2xl p-5 flex items-center gap-4">
          <div className="text-3xl">🎉</div>
          <div>
            <div className="font-display text-2xl">Bienvenue {user.displayName.split(" ")[0]} !</div>
            <div className="text-sm text-[var(--color-cream-dim)]">Ton compte est créé. Tu peux maintenant réserver et rejoindre des groupes.</div>
          </div>
        </div>
      )}
      {error === "admin-required" && (
        <div className="mb-8 border border-[var(--color-amber)]/40 bg-[var(--color-amber)]/5 rounded-2xl p-5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-amber)] mr-2">accès refusé</span>
          Cette section est réservée à l&apos;équipe Bad&apos;s Club.
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Profile card */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] p-6 sticky top-24">
            <div className="w-16 h-16 rounded-full bg-[var(--color-lime)] text-[var(--color-ink)] grid place-items-center font-display text-3xl mb-4">
              {user.displayName.slice(0, 1)}
            </div>
            <div className="font-display text-2xl leading-tight">{user.displayName}</div>
            <div className="text-xs text-[var(--color-muted)] mt-1 font-mono break-all">{user.email}</div>
            <div className="mt-3 inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[var(--color-lime)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-lime)]" />
              {user.role === "admin" ? "Admin Bad's" : "Membre actif"}
            </div>

            <nav className="mt-6 space-y-1 text-sm">
              {[
                ["Réservations", "#reservations"],
                ["Mes groupes", "#groupes"],
                ["Abonnement", "#abonnement"],
                ["Profil", "#profil"],
              ].map(([l, h]) => (
                <a key={l} href={h} className="block px-3 py-2 rounded-lg hover:bg-white/5 hover:text-[var(--color-lime)] transition">
                  {l}
                </a>
              ))}
              {user.role === "admin" && (
                <Link href="/admin" className="block px-3 py-2 rounded-lg text-[var(--color-lime)] hover:bg-[var(--color-lime)]/10">
                  → Espace admin
                </Link>
              )}
              <button onClick={onLogout} className="w-full text-left px-3 py-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-amber)] hover:bg-white/5 transition mt-3">
                Se déconnecter
              </button>
            </nav>
          </div>
        </aside>

        {/* Main */}
        <section className="col-span-12 lg:col-span-9 space-y-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-2">
              Tableau de bord
            </div>
            <h1 className="font-display text-5xl lg:text-6xl tracking-tight">
              Salut {user.displayName.split(" ")[0]} <span className="text-[var(--color-lime)]">↗</span>
            </h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              ["12", "sessions ce mois"],
              ["3", "groupes actifs"],
              ["180€", "dépensé · 2026"],
              ["−20%", "tarif membre"],
            ].map(([k, l]) => (
              <div key={l} className="rounded-2xl border border-white/10 bg-[var(--color-ink-2)] p-5">
                <div className="font-display text-4xl text-[var(--color-lime)]">{k}</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted)] mt-1">{l}</div>
              </div>
            ))}
          </div>

          {/* Notification preferences */}
          <NotifPreferences email={user.email} phone={user.phone} />

          {/* Reservations */}
          <div id="reservations" className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] overflow-hidden">
            <div className="px-6 py-5 flex items-center justify-between border-b border-white/10">
              <div>
                <div className="font-display text-2xl">Mes prochaines réservations</div>
                <div className="text-xs font-mono text-[var(--color-muted)] mt-1">3 à venir</div>
              </div>
              <Link href="/reservation" className="btn-lime px-5 py-2 rounded-full text-sm">+ Réserver</Link>
            </div>
            <div className="divide-y divide-white/10">
              {[
                ["Jeu. 22 mai", "19h00 → 20h00", "Badminton · BAD—02", "confirmé"],
                ["Sam. 24 mai", "10h00 → 11h00", "Squash · SQS—04", "confirmé"],
                ["Lun. 26 mai", "20h00 → 21h00", "Badminton · BAD—01", "en attente"],
              ].map(([d, h, t, s], i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <div className="font-display text-xl">{t}</div>
                    <div className="text-xs font-mono text-[var(--color-muted)] mt-0.5">{d} · {h}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full ${
                      s === "confirmé"
                        ? "bg-[var(--color-lime)]/10 text-[var(--color-lime)] border border-[var(--color-lime)]/30"
                        : "bg-[var(--color-amber)]/10 text-[var(--color-amber)] border border-[var(--color-amber)]/30"
                    }`}>{s}</span>
                    <button className="text-xs text-[var(--color-muted)] hover:text-[var(--color-amber)]">Annuler</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Groups */}
          <div id="groupes" className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="font-display text-2xl">Mes groupes</div>
              <Link href="/communaute" className="font-mono text-xs text-[var(--color-lime)] hover:underline">Tous les groupes →</Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                ["Double mixte du jeudi", "🏸", 14],
                ["Squash After-Work", "🎾", 23],
                ["Pétanque Lounge", "🥖", 31],
              ].map(([n, e, m], i) => (
                <Link key={i} href={`/communaute/${["double-mixte-jeudi","squash-after-work","petanque-club-lounge"][i]}`}
                  className="lift block border border-white/10 rounded-2xl p-4 bg-[var(--color-ink)]">
                  <div className="flex items-center justify-between">
                    <div className="text-3xl">{e}</div>
                    <span className="text-[10px] font-mono text-[var(--color-muted)]">{m} membres</span>
                  </div>
                  <div className="mt-3 font-display text-xl">{n}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Subscription */}
          <div id="abonnement" className="rounded-3xl border border-white/10 bg-gradient-to-br from-[var(--color-ink-2)] to-[var(--color-ink-3)] p-8 relative overflow-hidden">
            <div className="absolute inset-0 court-lines opacity-20" />
            <div className="relative grid grid-cols-12 gap-6 items-center">
              <div className="col-span-12 lg:col-span-7">
                <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-lime)] mb-2">
                  Adhésion Bad&apos;s · Active
                </div>
                <div className="font-display text-4xl">Formule Annuelle</div>
                <div className="text-sm text-[var(--color-cream-dim)] mt-2">
                  Tarifs membres −20%, accès prioritaire aux tournois, 4 invités gratuits par mois.
                </div>
                <div className="text-xs font-mono text-[var(--color-muted)] mt-4">
                  Prochaine échéance · 11 mars 2027 · 240€/an
                </div>
              </div>
              <div className="col-span-12 lg:col-span-5 flex flex-col gap-2">
                <button className="btn-ghost px-5 py-3 rounded-full text-sm">Gérer mon abonnement</button>
                <button className="btn-ghost px-5 py-3 rounded-full text-sm">Mettre à jour le moyen de paiement</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
