import { ARTICLES } from "@/lib/mock";

export default function AdminPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-3">
            Espace admin · Bad's Studio
          </div>
          <h1 className="font-display text-5xl lg:text-7xl tracking-tight">
            Un article. <em className="text-[var(--color-lime)]">Tous tes réseaux.</em>
          </h1>
          <p className="mt-4 text-[var(--color-cream-dim)] max-w-2xl">
            Tu rédiges une seule fois. L'IA reformate pour Instagram, Facebook et LinkedIn,
            programme la publication, et te montre l'aperçu avant envoi.
          </p>
        </div>
        <button className="btn-lime px-7 py-3.5 rounded-full font-medium hidden md:inline-block">
          + Nouvel article
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Article editor (left) */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
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

            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/10">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Visuel</span>
              <div className="w-16 h-10 rounded-md bg-gradient-to-br from-[#d6ff3e] to-[#a8d423]" />
              <span className="text-xs font-mono text-[var(--color-muted)]">tournoi-printemps-cover.jpg</span>
              <button className="ml-auto text-xs font-mono text-[var(--color-muted)] hover:text-[var(--color-lime)]">+ générer avec IA</button>
            </div>
          </div>

          {/* Workflow */}
          <div className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] p-8">
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-5">
              Pipeline d'automatisation
            </div>
            <div className="grid md:grid-cols-5 gap-3 items-stretch">
              {[
                { n: "01", t: "Rédaction", s: "Article rédigé", d: true },
                { n: "02", t: "IA reformat", s: "3 variantes prêtes", d: true },
                { n: "03", t: "Validation", s: "En attente · toi", d: false },
                { n: "04", t: "Programmation", s: "Jeu. 22 mai · 09h", d: false },
                { n: "05", t: "Publication", s: "IG · FB · LinkedIn", d: false },
              ].map((s, i) => (
                <div key={i} className={`relative rounded-2xl p-4 border ${
                  s.d ? "border-[var(--color-lime)]/40 bg-[var(--color-lime)]/5" : "border-white/10 bg-white/[0.02]"
                }`}>
                  <div className={`font-mono text-[10px] tracking-widest mb-2 ${
                    s.d ? "text-[var(--color-lime)]" : "text-[var(--color-muted)]"
                  }`}>{s.n}</div>
                  <div className="font-display text-xl leading-tight">{s.t}</div>
                  <div className="text-[10px] mt-1 text-[var(--color-cream-dim)]">{s.s}</div>
                  {s.d && <div className="absolute top-3 right-3 text-[var(--color-lime)]">✓</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social previews (right) */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-1">
            Aperçus générés par l'IA
          </div>

          {/* Instagram */}
          <SocialCard
            network="Instagram"
            handle="@badsclub.lyon"
            color="from-[#ff8a3c] to-[#c14d2a]"
            cover="from-[#d6ff3e] to-[#a8d423]"
            caption="🏸 Le Tournoi de Printemps est de retour ! 14 & 15 juin · 3 tableaux · 80 joueurs · 1 seul gagnant. Inscriptions en bio ↑"
            tags="#badminton #lyon #tournoi #badsclub"
          />

          {/* LinkedIn */}
          <SocialCard
            network="LinkedIn"
            handle="Bad's Club Lyon"
            color="from-[#0a66c2] to-[#004182]"
            cover="from-[#d6ff3e] to-[#a8d423]"
            caption="Le Bad's Club organise son tournoi annuel les 14 & 15 juin. Au-delà du sport, un moment fédérateur ouvert aux entreprises lyonnaises : équipes de salariés, after-work, networking sportif. Contactez-nous pour intégrer une équipe."
            tags="#sport #entreprise #lyon #événementiel"
          />

          {/* Facebook */}
          <SocialCard
            network="Facebook"
            handle="Bad's Club"
            color="from-[#1877f2] to-[#0a4ea0]"
            cover="from-[#d6ff3e] to-[#a8d423]"
            caption="📅 Save the date — 14 & 15 juin, le Tournoi de Printemps revient ! Adhérents 18€, non-adhérents 28€. Buvette & restauration sur place tout le week-end. On vous attend nombreux 💪"
            tags=""
          />
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

function SocialCard({ network, handle, color, cover, caption, tags }: {
  network: string; handle: string; color: string; cover: string; caption: string; tags: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--color-ink-2)] overflow-hidden lift">
      <div className={`flex items-center justify-between px-4 py-3 bg-gradient-to-r ${color} text-white`}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/20 grid place-items-center text-xs font-bold">B</div>
          <div>
            <div className="text-xs font-medium">{handle}</div>
            <div className="text-[10px] opacity-70">{network} · prévisualisation</div>
          </div>
        </div>
        <button className="text-[10px] font-mono uppercase tracking-widest opacity-80 hover:opacity-100">éditer</button>
      </div>
      <div className={`aspect-[16/9] bg-gradient-to-br ${cover} relative`}>
        <div className="absolute inset-0 court-lines opacity-30" />
        <div className="absolute bottom-3 left-4 right-4 font-display text-[var(--color-ink)] text-2xl leading-tight">
          Tournoi de<br/>Printemps 2026
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-[var(--color-cream-dim)] leading-relaxed">{caption}</p>
        {tags && <p className="text-xs text-[var(--color-lime)] mt-2 font-mono">{tags}</p>}
      </div>
    </div>
  );
}
