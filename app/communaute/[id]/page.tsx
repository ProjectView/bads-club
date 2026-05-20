import Link from "next/link";
import { GROUPS, MESSAGES } from "@/lib/mock";

export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const group = GROUPS.find(g => g.id === id) ?? GROUPS[0];

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
      <Link href="/communaute" className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-lime)]">
        ← Communauté
      </Link>

      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* Header card */}
        <div className="col-span-12 rounded-3xl border border-white/10 bg-gradient-to-br from-[var(--color-ink-2)] to-[var(--color-ink-3)] p-8 lg:p-10 relative overflow-hidden">
          <div className="absolute inset-0 court-lines opacity-30" />
          <div className="relative flex items-center justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-6">
              <div className="text-7xl">{group.avatar}</div>
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-lime)] mb-2">
                  {group.sport} · {group.members} membres
                </div>
                <h1 className="font-display text-5xl lg:text-6xl leading-none">{group.name}</h1>
                <div className="mt-3 text-sm text-[var(--color-cream-dim)]">
                  Prochaine session : <span className="text-[var(--color-cream)]">{group.next}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/reservation" className="btn-lime px-6 py-3 rounded-full text-sm">
                Réserver pour le groupe →
              </Link>
              <button className="btn-ghost px-6 py-3 rounded-full text-sm">Quitter le groupe</button>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="col-span-12 lg:col-span-8 order-2 lg:order-1">
          <div className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] overflow-hidden flex flex-col h-[520px] lg:h-[640px]">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="font-display text-2xl">Discussion</div>
                <div className="text-xs font-mono text-[var(--color-muted)] flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-lime)] pulse-dot" />
                  3 membres en ligne · sync Firestore
                </div>
              </div>
              <div className="flex items-center -space-x-2">
                {["LM","AR","SB","MD","TM"].map((a, i) => (
                  <div key={i}
                    className="w-8 h-8 rounded-full border-2 border-[var(--color-ink-2)] grid place-items-center font-mono text-[10px] font-bold text-[var(--color-ink)]"
                    style={{ background: ["#d6ff3e","#ff8a3c","#f4ede0","#a8d423","#c14d2a"][i] }}>
                    {a}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="text-center text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-widest">
                Aujourd'hui
              </div>
              {MESSAGES.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.you ? "flex-row-reverse" : ""}`}>
                  <div className="w-9 h-9 rounded-full grid place-items-center font-mono text-[10px] font-bold text-[var(--color-ink)] shrink-0"
                    style={{ background: m.you ? "var(--color-lime)" : ["#d6ff3e","#ff8a3c","#f4ede0","#a8d423","#c14d2a","#d6ff3e"][i] }}>
                    {m.avatar}
                  </div>
                  <div className={`max-w-[75%] ${m.you ? "items-end" : ""} flex flex-col`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs font-medium">{m.from}</span>
                      <span className="text-[10px] font-mono text-[var(--color-muted)]">{m.time}</span>
                    </div>
                    <div className={`px-4 py-3 rounded-2xl text-sm ${
                      m.you
                        ? "bg-[var(--color-lime)] text-[var(--color-ink)] rounded-tr-md"
                        : "bg-white/5 rounded-tl-md"
                    }`}>
                      {m.text}
                    </div>
                  </div>
                </div>
              ))}

              {/* Booking embed */}
              <div className="ml-12 max-w-[420px] border border-[var(--color-lime)]/30 rounded-2xl bg-[var(--color-lime)]/5 p-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-lime)] mb-2">
                  ↳ Léa M. a réservé un terrain
                </div>
                <div className="font-display text-2xl">Badminton · BAD—02</div>
                <div className="text-xs text-[var(--color-cream-dim)] mt-1">Jeu. 22 mai · 19h00 → 20h00 · 4 places restantes</div>
                <button className="mt-3 px-4 py-2 rounded-full bg-[var(--color-lime)] text-[var(--color-ink)] text-xs font-medium">
                  Je participe (3/8)
                </button>
              </div>
            </div>

            <div className="border-t border-white/10 p-4 flex gap-3">
              <input
                placeholder="Écris un message au groupe…"
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[var(--color-lime)]"
              />
              <button className="btn-lime w-12 h-12 rounded-full grid place-items-center text-lg">↑</button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-4 order-1 lg:order-2">
          <div className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] p-6">
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-3">Prochaines sessions</div>
            {[
              ["Jeu. 22 mai", "19h00 → 20h00", "Terrain 2", true],
              ["Jeu. 29 mai", "19h00 → 20h00", "Terrain 3", false],
              ["Jeu. 5 juin", "19h00 → 20h00", "À booker", false],
            ].map(([d, h, t, live], i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div>
                  <div className="text-sm">{d}</div>
                  <div className="text-xs font-mono text-[var(--color-muted)]">{h} · {t}</div>
                </div>
                {live ? (
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-lime)]">confirmé</span>
                ) : (
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted)]">en attente</span>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] p-6">
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-3">Stats du groupe</div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["sessions", "48"],
                ["taux présence", "92%"],
                ["membres réguliers", "9"],
                ["créé le", "11/24"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="font-display text-3xl text-[var(--color-lime)]">{v}</div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted)]">{k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
