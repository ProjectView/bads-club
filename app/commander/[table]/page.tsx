"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { BAR_ORDER_MENU, BAR_TABLES, type BarCategory } from "@/lib/mock";

const CATEGORIES: BarCategory[] = ["Bières", "Softs & Cocktails", "Planches & Snacks", "Pinsas"];

type Step = "menu" | "panier" | "paiement" | "confirmation";
type CartMap = Record<string, number>; // itemId -> qty

function euros(n: number) {
  return `${n.toFixed(2).replace(".", ",")} €`;
}

export default function CommanderPage() {
  const params = useParams<{ table: string }>();
  const table = BAR_TABLES.find(t => t.id.toLowerCase() === params.table?.toLowerCase()) ?? BAR_TABLES[0];

  const [step, setStep] = useState<Step>("menu");
  const [cart, setCart] = useState<CartMap>({});
  const [activeCat, setActiveCat] = useState<BarCategory>("Bières");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const lines = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([itemId, qty]) => {
        const item = BAR_ORDER_MENU.find(m => m.id === itemId)!;
        return { item, qty, subtotal: item.price * qty };
      });
  }, [cart]);

  const total = lines.reduce((s, l) => s + l.subtotal, 0);
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);

  function addItem(id: string) {
    setCart(c => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  }
  function removeItem(id: string) {
    setCart(c => {
      const next = { ...c, [id]: Math.max((c[id] ?? 0) - 1, 0) };
      return next;
    });
  }

  function confirmPayment() {
    const num = `BC-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderNumber(num);
    setStep("confirmation");
  }

  return (
    <div className="max-w-[640px] mx-auto px-5 pb-32 pt-8 min-h-[100dvh]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)] mb-1">
            Bad's Club · Commande au bar
          </div>
          <h1 className="font-display text-4xl">
            {table.label} <span className="text-[var(--color-lime)]">· {table.zone}</span>
          </h1>
        </div>
        <div className="font-mono text-[10px] text-[var(--color-muted)] text-right leading-relaxed">
          QR table<br/>scanné ✓
        </div>
      </div>

      {step === "menu" && (
        <>
          <p className="text-sm text-[var(--color-cream-dim)] mb-6">
            Compose ta commande, paie directement depuis ton téléphone, et viens la récupérer au bar quand elle est prête. Pas besoin de faire la queue.
          </p>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-5 -mx-1 px-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`shrink-0 font-mono text-[11px] uppercase tracking-widest px-4 py-2.5 rounded-full border transition-all ${
                  activeCat === cat
                    ? "border-[var(--color-lime,#d6ff3e)] text-[var(--color-lime,#d6ff3e)] bg-[rgba(214,255,62,0.06)]"
                    : "border-white/10 text-[var(--color-muted)] hover:border-white/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Items */}
          <div className="space-y-3">
            {BAR_ORDER_MENU.filter(m => m.category === activeCat).map(item => {
              const qty = cart[item.id] ?? 0;
              return (
                <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[rgba(245,240,232,0.03)] p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base">{item.name}</span>
                      {item.badge && (
                        <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[rgba(214,255,62,0.1)] text-[var(--color-lime,#d6ff3e)] border border-[rgba(214,255,62,0.25)]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.detail && <div className="text-xs text-[var(--color-muted)] mt-0.5">{item.detail}</div>}
                    <div className="font-mono text-sm text-[var(--gold,#bda41a)] mt-1">{euros(item.price)}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {qty > 0 && (
                      <>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-8 h-8 rounded-full border border-white/15 grid place-items-center text-lg leading-none hover:border-white/40 transition"
                          aria-label="Retirer"
                        >−</button>
                        <span className="font-mono text-sm w-4 text-center">{qty}</span>
                      </>
                    )}
                    <button
                      onClick={() => addItem(item.id)}
                      className="w-8 h-8 rounded-full bg-[var(--color-lime,#d6ff3e)] text-black grid place-items-center text-lg leading-none hover:opacity-90 transition"
                      aria-label="Ajouter"
                    >+</button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {step === "panier" && (
        <>
          <h2 className="font-display text-3xl mb-4">Ton panier</h2>
          {lines.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)]">Ton panier est vide pour l'instant.</p>
          ) : (
            <div className="space-y-3 mb-6">
              {lines.map(({ item, qty, subtotal }) => (
                <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[rgba(245,240,232,0.03)] p-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{item.name}</div>
                    <div className="font-mono text-[11px] text-[var(--color-muted)] mt-0.5">{qty} × {euros(item.price)}</div>
                  </div>
                  <div className="font-mono text-sm text-[var(--color-lime,#d6ff3e)] shrink-0">{euros(subtotal)}</div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => removeItem(item.id)} className="w-7 h-7 rounded-full border border-white/15 grid place-items-center text-base leading-none hover:border-white/40 transition">−</button>
                    <button onClick={() => addItem(item.id)} className="w-7 h-7 rounded-full bg-[var(--color-lime,#d6ff3e)] text-black grid place-items-center text-base leading-none hover:opacity-90 transition">+</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-[rgba(245,240,232,0.03)] p-5 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)]">Total à régler</span>
            <span className="font-display text-3xl text-[var(--color-lime,#d6ff3e)]">{euros(total)}</span>
          </div>
        </>
      )}

      {step === "paiement" && (
        <PaymentScreen total={total} onPaid={confirmPayment} onBack={() => setStep("panier")} />
      )}

      {step === "confirmation" && orderNumber && (
        <div className="text-center pt-10">
          <div className="w-16 h-16 rounded-full bg-[var(--color-lime,#d6ff3e)] text-black grid place-items-center mx-auto mb-6 text-3xl">✓</div>
          <h2 className="font-display text-4xl mb-2">Commande envoyée !</h2>
          <p className="text-sm text-[var(--color-cream-dim)] max-w-sm mx-auto mb-6">
            Ta commande <span className="text-[var(--color-lime,#d6ff3e)] font-mono">{orderNumber}</span> est partie au bar.
            On te prévient ici dès qu'elle est prête à être récupérée — viens directement la chercher au comptoir.
          </p>
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest px-4 py-2.5 rounded-full border border-[rgba(214,255,62,0.25)] text-[var(--color-lime,#d6ff3e)] bg-[rgba(214,255,62,0.06)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-lime,#d6ff3e)] pulse-dot" />
            Statut : en préparation
          </div>
          <button
            onClick={() => { setCart({}); setOrderNumber(null); setStep("menu"); }}
            className="block mx-auto mt-8 font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-lime,#d6ff3e)] underline underline-offset-4"
          >
            Passer une nouvelle commande
          </button>
        </div>
      )}

      {/* Bottom action bar */}
      {step !== "confirmation" && (
        <div className="fixed bottom-0 left-0 right-0 z-10">
          <div className="max-w-[640px] mx-auto px-5 pb-5 pt-3">
            <div className="rounded-2xl border border-white/10 bg-[rgba(8,8,8,0.85)] backdrop-blur-md p-3 flex items-center gap-3"
                 style={{ boxShadow: "0 -8px 30px rgba(0,0,0,0.4)" }}>
              {step === "menu" && (
                <>
                  <div className="flex-1 px-2">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]">{itemCount} article{itemCount > 1 ? "s" : ""}</div>
                    <div className="font-display text-xl text-[var(--color-lime,#d6ff3e)]">{euros(total)}</div>
                  </div>
                  <button
                    disabled={itemCount === 0}
                    onClick={() => setStep("panier")}
                    className="px-6 py-3 rounded-full font-medium text-sm bg-[var(--color-lime,#d6ff3e)] text-black disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    Voir le panier →
                  </button>
                </>
              )}
              {step === "panier" && (
                <>
                  <button
                    onClick={() => setStep("menu")}
                    className="px-5 py-3 rounded-full font-mono text-xs uppercase tracking-widest border border-white/15 text-[var(--color-muted)] hover:border-white/35 transition"
                  >
                    ← Menu
                  </button>
                  <button
                    disabled={itemCount === 0}
                    onClick={() => setStep("paiement")}
                    className="flex-1 px-6 py-3 rounded-full font-medium text-sm bg-[var(--color-lime,#d6ff3e)] text-black disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    Payer {euros(total)} →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Écran de paiement ───────────────────────────────────────────────────
   Template générique destiné à être remplacé par le module hébergé de la
   banque (ex. solution e-commerce Crédit Agricole / Worldline). En prod,
   ce composant redirigera vers — ou intégrera l'iframe de — la page de
   paiement sécurisée fournie par la banque. Les boutons Apple Pay / Google
   Pay sont ici de simples maquettes : leur disponibilité réelle dépend des
   options proposées par le contrat e-commerce de la banque.
------------------------------------------------------------------------- */
function PaymentScreen({ total, onPaid, onBack }: { total: number; onPaid: () => void; onBack: () => void }) {
  const [processing, setProcessing] = useState(false);

  function pay() {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); onPaid(); }, 1100);
  }

  return (
    <div>
      <button onClick={onBack} className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-lime,#d6ff3e)] mb-5">← Retour au panier</button>

      <div className="rounded-2xl border border-white/10 bg-[rgba(245,240,232,0.03)] p-5 mb-5">
        <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-2">Montant à régler</div>
        <div className="font-display text-4xl text-[var(--color-lime,#d6ff3e)]">{euros(total)}</div>
        <div className="text-xs text-[var(--color-muted)] mt-1">Paiement sécurisé · module bancaire du bar</div>
      </div>

      <div className="rounded-2xl border border-dashed border-[rgba(214,255,62,0.25)] bg-[rgba(214,255,62,0.04)] p-4 mb-5">
        <p className="text-xs text-[var(--color-cream-dim)] leading-relaxed">
          <span className="text-[var(--color-lime,#d6ff3e)] font-mono uppercase tracking-widest text-[10px]">Emplacement à intégrer · </span>
          écran de paiement hébergé fourni par la banque (ex. solution e-commerce Crédit Agricole). En prod, ce
          bloc redirige vers — ou affiche l'iframe — de la page de paiement sécurisée de la banque.
        </p>
      </div>

      <div className="space-y-2.5 mb-6">
        <PayOption label="Apple Pay" icon={<AppleIcon />} onClick={pay} />
        <PayOption label="Google Pay" icon={<GoogleIcon />} onClick={pay} />
        <PayOption label="Carte bancaire" icon={<CardIcon />} onClick={pay} />
      </div>

      {processing && (
        <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-muted)] justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-lime,#d6ff3e)] pulse-dot" />
          Traitement du paiement…
        </div>
      )}
    </div>
  );
}

function PayOption({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 rounded-2xl border border-white/10 bg-[rgba(245,240,232,0.03)] hover:border-white/25 p-4 transition text-left"
    >
      <span className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 grid place-items-center text-[var(--color-cream-dim)]">{icon}</span>
      <span className="flex-1 text-sm">{label}</span>
      <span className="font-mono text-[var(--color-lime,#d6ff3e)] text-sm">→</span>
    </button>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.564 16.18c-.353.81-.52 1.17-.972 1.89-.63 1-1.518 2.25-2.62 2.26-.98.01-1.233-.64-2.562-.63-1.33.01-1.605.64-2.586.63-1.1-.01-1.94-1.13-2.57-2.13-1.764-2.78-1.95-6.04-.86-7.78.77-1.23 1.99-1.95 3.14-1.95 1.17 0 1.91.65 2.88.65.94 0 1.52-.65 2.88-.65 1.02 0 2.1.56 2.87 1.52-2.52 1.38-2.11 4.98.4 6.18z"/>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M21.6 12.23c0-.7-.06-1.37-.18-2.02H12v3.83h5.4a4.62 4.62 0 0 1-2 3.03v2.5h3.24c1.9-1.75 3-4.32 3-7.34Z" fill="#4285F4"/>
      <path d="M12 22c2.7 0 4.96-.9 6.6-2.43l-3.23-2.5c-.9.6-2.04.96-3.37.96-2.59 0-4.78-1.75-5.56-4.1H3.1v2.58A10 10 0 0 0 12 22Z" fill="#34A853"/>
      <path d="M6.44 13.93a6 6 0 0 1 0-3.86V7.49H3.1a10 10 0 0 0 0 9.02l3.34-2.58Z" fill="#FBBC05"/>
      <path d="M12 6.07c1.47 0 2.79.5 3.82 1.5l2.86-2.86C16.95 2.99 14.7 2 12 2A10 10 0 0 0 3.1 7.49l3.34 2.58c.78-2.35 2.97-4 5.56-4Z" fill="#EA4335"/>
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M3 10h18" />
      <path d="M7 14.5h4" />
    </svg>
  );
}
