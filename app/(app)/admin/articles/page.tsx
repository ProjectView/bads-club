"use client";

import { useState } from "react";
import { ARTICLES } from "@/lib/mock";

const NETWORKS = [
  {
    id: "instagram",
    network: "Instagram",
    handle: "@badsclub.lyon",
    color: "from-[#ff8a3c] to-[#c14d2a]",
    cover: "from-[#d6ff3e] to-[#a8d423]",
    caption: "🏸 Le Tournoi de Printemps est de retour ! 14 & 15 juin · 3 tableaux · 80 joueurs · 1 seul gagnant. Inscriptions en bio ↑",
    tags: "#badminton #lyon #tournoi #badsclub",
  },
  {
    id: "linkedin",
    network: "LinkedIn",
    handle: "Bad's Club Lyon",
    color: "from-[#0a66c2] to-[#004182]",
    cover: "from-[#d6ff3e] to-[#a8d423]",
    caption: "Le Bad's Club organise son tournoi annuel les 14 & 15 juin. Au-delà du sport, un moment fédérateur ouvert aux entreprises lyonnaises : équipes de salariés, after-work, networking sportif. Contactez-nous pour intégrer une équipe.",
    tags: "#sport #entreprise #lyon #événementiel",
  },
  {
    id: "facebook",
    network: "Facebook",
    handle: "Bad's Club",
    color: "from-[#1877f2] to-[#0a4ea0]",
    cover: "from-[#d6ff3e] to-[#a8d423]",
    caption: "📅 Save the date — 14 & 15 juin, le Tournoi de Printemps revient ! Adhérents 18€, non-adhérents 28€. Buvette & restauration sur place tout le week-end. On vous attend nombreux 💪",
    tags: "",
  },
] as const;

const STEPS = [
  { n: "01", t: "Rédaction", s: "Article rédigé", d: true },
  { n: "02", t: "IA reformat", s: "3 variantes prêtes", d: true },
  { n: "03", t: "Validation", s: "En attente · toi", d: false },
  { n: "04", t: "Programmation", s: "Jeu. 22 mai · 09h", d: false },
  { n: "05", t: "Publication", s: "IG · FB · LinkedIn", d: false },
];

export default function AdminPage() {
  const [activeNetwork, setActiveNetwork] = useState<typeof NETWORKS[number]["id"]>("instagram");
  const current = NETWORKS.find(n => n.id === activeNetwork)!;

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-3">
            Espace admin · Bad's Studio
          </div>
          <h1 className="font-display text-5xl lg:text-7xl">
            Un article. <span className="text-[var(--color-lime)]">Tous tes réseaux.</span>
          </h1>
          <p className="mt-4 text-[var(--color-cream-dim)] max-w-2xl">
            Tu rédiges une seule fois. L'IA reformate pour Instagram, Facebook et LinkedIn,
            programme la publication, et te montre l'aperçu avant envoi.
          </p>
        </div>
        <button className="btn-lime px-7 py-3.5 rounded-full font-medium">
          + Nouvel article
        </button>
      </div>

      {/* Pipeline — compact horizontal stepper */}
      <div className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] px-6 py-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)]">
            Pipeline d'automatisation
          </div>
          <div className="font-mono text-[10px] text-[var(--color-cream-dim)]">
            Étape 3/5 · validation requise
          </div>
        </div>
        <div className="flex items-stretch gap-2 overflow-x-auto">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1 min-w-[150px]">
              <div className={`flex-1 rounded-2xl px-4 py-3 border flex items-center gap-3 ${
                s.d ? "border-[var(--color-lime)]/40 bg-[var(--color-lime)]/5" : "border-white/10 bg-white/[0.02]"
              }`}>
                <div className={`shrink-0 w-7 h-7 rounded-full grid place-items-center font-mono text-[10px] ${
                  s.d ? "bg-[var(--color-lime)] text-[var(--color-ink)]" : "bg-white/5 text-[var(--color-muted)] border border-white/10"
                }`}>
                  {s.d ? "✓" : s.n}
                </div>
                <div className="min-w-0">
                  <div className="font-display text-base leading-tight truncate">{s.t}</div>
                  <div className="text-[10px] text-[var(--color-cream-dim)] truncate">{s.s}</div>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-4 h-px shrink-0 ${s.d ? "bg-[var(--color-lime)]/40" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Article editor (left) */}
        <div className="col-span-12 lg:col-span-7">
          <div className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] p-8">
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-3 flex items-center justify-between">
              <span>Article source</span>
              <span className="flex items-center gap-2 text-[var(--color-lime)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-lime)] pulse-dot" />
                sauvegardé · il y a 2s
              </span>
            </div>

            <input
              defaultValue="Tournoi de Printemps 2026 — les inscriptions sont ouvertes"
              className="w-full bg-transparent font-display text-3xl lg:text-4xl leading-tight outline-none border-b border-white/10 pb-4 mb-4 focus:border-[var(--color-lime)]"
            />

            <textarea
              defaultValue={`Le rendez-vous incontournable du club revient pour sa 14ème édition. Trois tableaux ouverts (simple homme, simple dame, double mixte), plus de 80 joueurs attendus sur le week-end des 14 et 15 juin.

Inscriptions en ligne ouvertes dès aujourd'hui. Tarif adhérent : 18€. Non-adhérents : 28€. Buvette et restauration assurées par le Lounge tout le week-end.

On attend votre meilleur niveau — et votre meilleure humeur.`}
              rows={10}
              className="w-full bg-transparent text-[var(--color-cream-dim)] leading-relaxed outline-none resize-none"
            />

            <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-white/10">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Visuel</span>
              <div className="w-16 h-10 rounded-md bg-gradient-to-br from-[#d6ff3e] to-[#a8d423] shrink-0" />
              <span className="text-xs font-mono text-[var(--color-muted)] truncate">tournoi-printemps-cover.jpg</span>
              <button className="ml-auto text-xs font-mono text-[var(--color-muted)] hover:text-[var(--color-lime)] whitespace-nowrap">+ générer avec IA</button>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-white/10">
              <button className="btn-lime px-6 py-3 rounded-full text-sm font-medium">
                Valider et programmer →
              </button>
              <button className="btn-ghost px-6 py-3 rounded-full text-sm">
                Régénérer avec l'IA
              </button>
              <span className="ml-auto font-mono text-[10px] text-[var(--color-muted)]">
                Programmation prévue · jeu. 22 mai, 09h00
              </span>
            </div>
          </div>
        </div>

        {/* Social preview (right) — single card with network switcher */}
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] overflow-hidden lift">
            <div className="px-5 pt-5">
              <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-3">
                Aperçu généré par l'IA
              </div>
              {/* Network tabs */}
              <div className="flex gap-2 mb-1">
                {NETWORKS.map(n => (
                  <button
                    key={n.id}
                    onClick={() => setActiveNetwork(n.id)}
                    className={`flex-1 font-mono text-[11px] uppercase tracking-widest px-3 py-2.5 rounded-full border transition-all ${
                      activeNetwork === n.id
                        ? "border-[var(--color-lime)] text-[var(--color-lime)] bg-[var(--color-lime)]/5"
                        : "border-white/10 text-[var(--color-muted)] hover:border-white/30"
                    }`}
                  >
                    {n.network}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 pt-4">
              <div className="rounded-2xl border border-white/10 overflow-hidden">
                <div className={`flex items-center justify-between px-4 py-3 bg-gradient-to-r ${current.color} text-white`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-white/20 grid place-items-center text-xs font-bold shrink-0">B</div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate">{current.handle}</div>
                      <div className="text-[10px] opacity-70">{current.network} · prévisualisation</div>
                    </div>
                  </div>
                  <button className="text-[10px] font-mono uppercase tracking-widest opacity-80 hover:opacity-100 shrink-0">éditer</button>
                </div>
                <div className={`aspect-[16/9] bg-gradient-to-br ${current.cover} relative`}>
                  <div className="absolute inset-0 court-lines opacity-30" />
                  <div className="absolute bottom-3 left-4 right-4 font-display text-[var(--color-ink)] text-2xl leading-tight">
                    Tournoi de<br/>Printemps 2026
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-[var(--color-cream-dim)] leading-relaxed">{current.caption}</p>
                  {current.tags && <p className="text-xs text-[var(--color-lime)] mt-2 font-mono">{current.tags}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 font-mono text-[10px] text-[var(--color-muted)]">
                <span>3 variantes générées · prêtes à valider</span>
                <span className="flex items-center gap-1.5 text-[var(--color-lime)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-lime)]" />
                  IA reformat terminé
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles list */}
      <div className="mt-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-4xl">Tous les articles</h2>
          <div className="font-mono text-xs text-[var(--color-muted)]">3 articles · 8 publications programmées</div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] divide-y divide-white/10 overflow-hidden">
          {ARTICLES.map(a => (
            <div key={a.id} className="flex items-center gap-5 p-5 hover:bg-white/[0.02] transition">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${a.cover} shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="font-display text-xl truncate">{a.title}</div>
                <div className="text-xs text-[var(--color-muted)] mt-0.5 truncate">{a.excerpt}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {a.channels.map(c => (
                  <span key={c} className="font-mono text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10">
                    {c}
                  </span>
                ))}
              </div>
              <div className="font-mono text-xs text-[var(--color-muted)] shrink-0 w-24 text-right">{a.date}</div>
              <StatusBadge status={a.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    "Publié": "bg-[var(--color-lime)] text-[var(--color-ink)]",
    "Programmé": "bg-[var(--color-amber)]/20 text-[var(--color-amber)] border border-[var(--color-amber)]/40",
    "Brouillon": "bg-white/5 text-[var(--color-muted)] border border-white/10",
  }[status] || "";
  return (
    <span className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full ${styles}`}>
      {status}
    </span>
  );
}
