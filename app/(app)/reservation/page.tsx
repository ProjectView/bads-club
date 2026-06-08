"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-context";
import { Modal } from "@/components/modal";
import { getAvailability, createHold, confirmHold, releaseHold, getQuote, joinWaitlist, type AvailabilityCell } from "@/lib/booking/service";
import { SPORTS } from "@/lib/booking/config";
import type { SlotStatus } from "@/lib/booking/types";

const ZONE_LABELS: Record<"red"|"blue"|"green", string> = {
  red: "Heure de pointe",
  blue: "Heure standard",
  green: "Heure creuse",
};
const ZONE_COLORS: Record<"red"|"blue"|"green", string> = {
  red: "#e74c3c", blue: "#3498db", green: "#27ae60",
};
import type { Hold, PriceQuote, Slot, SportId } from "@/lib/booking/types";
import s from "./page.module.css";

const SPORT_TABS = [
  { id: "badminton"    as SportId, label: "Badminton",       code: "BAD", price: 18, maxPlayers: 4 },
  { id: "squash"       as SportId, label: "Squash",          code: "SQS", price: 18, maxPlayers: 2 },
  { id: "petanque"     as SportId, label: "Pétanque",        code: "PET", price: 20, maxPlayers: 6 },
  { id: "tennis_table" as SportId, label: "Tennis de table", code: "TT",  price: 12, maxPlayers: 4 },
  { id: "baseball"     as SportId, label: "Baseball",        code: "BBL", price: 25, maxPlayers: 2 },
];

const TODAY = (() => { const d = new Date(); d.setHours(0,0,0,0); return d; })();

type SelectedSlot = { slot: Slot; hold?: Hold; quote?: PriceQuote; remainingMs: number };

export default function ReservationPage() {
  const { user } = useAuth();
  const [sport, setSport] = useState<SportId>("badminton");
  const [selectedDate, setSelectedDate] = useState<Date>(TODAY);
  const [cells, setCells] = useState<AvailabilityCell[]>([]);
  const [tick, setTick]     = useState(0);
  const [selections, setSelections] = useState<SelectedSlot[]>([]);
  const [players, setPlayers] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState<string[] | null>(null);
  const [waitlistTarget, setWaitlistTarget]     = useState<Slot | null>(null);
  const [waitlistConfirmed, setWaitlistConfirmed] = useState<string | null>(null);

  const sportData = SPORT_TABS.find(s => s.id === sport)!;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getAvailability({ sportId: sport, day: selectedDate, currentUserId: user?.uid });
      if (!cancelled) setCells(data);
    })();
    return () => { cancelled = true; };
  }, [sport, selectedDate, user?.uid, tick]);

  useEffect(() => { const t = setInterval(() => setTick(x => x+1), 15_000); return () => clearInterval(t); }, []);

  useEffect(() => {
    if (!selections.length) return;
    const t = setInterval(() => {
      setSelections(prev => {
        const now = Date.now(); let changed = false;
        const next = prev.map(s => { if (!s.hold) return s; const ms = Math.max(0, s.hold.expiresAt.getTime()-now); if (ms!==s.remainingMs) changed=true; return {...s,remainingMs:ms}; });
        const filtered = next.filter(s => !s.hold||s.remainingMs>0);
        if (filtered.length < next.length) { setError("Un créneau a expiré, il a été libéré."); setTick(x=>x+1); return filtered; }
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [selections.length]);

  useEffect(() => { setPlayers(p => Math.min(p, sportData.maxPlayers)); }, [sport, sportData.maxPlayers]);

  const isMember = !!user;

  const onClearAll = useCallback(async () => {
    if (user) await Promise.all(selections.map(s => s.hold ? releaseHold(s.hold.id, user.uid).catch(()=>{}) : null));
    setSelections([]); setError(null); setTick(x=>x+1);
  }, [user, selections]);

  const onToggleSlot = useCallback(async (slot: Slot) => {
    setError(null); setConfirmed(null);
    if (slot.status === "booked" && user) { setWaitlistTarget(slot); return; }
    if (slot.status !== "free") return;
    const existing = selections.find(s => s.slot.key === slot.key);
    if (existing) {
      if (user && existing.hold) await releaseHold(existing.hold.id, user.uid).catch(()=>{});
      setSelections(prev => prev.filter(s => s.slot.key !== slot.key));
      setTick(x=>x+1); return;
    }
    if (!user) {
      const quote = getQuote({ courtId: slot.courtId, slotStart: slot.startsAt, isMember: false });
      setSelections(prev => [...prev, { slot, quote, remainingMs: 0 }]); return;
    }
    const result = await createHold({ courtId: slot.courtId, slotStart: slot.startsAt, userId: user.uid, isMember, isAdmin: user.role==="admin" });
    if ("error" in result) { setError(result.error.message); setTick(x=>x+1); return; }
    setSelections(prev => [...prev, { slot, hold: result.hold, quote: result.quote, remainingMs: result.hold.expiresAt.getTime()-Date.now() }]);
    setTick(x=>x+1);
  }, [user, isMember, selections]);

  const onConfirmAll = useCallback(async () => {
    if (!user || !selections.length) return;
    setConfirming(true); setError(null);
    const confirmedIds: string[] = [];
    for (const sel of selections) {
      if (!sel.hold) continue;
      const result = await confirmHold({ holdId: sel.hold.id, userId: user.uid, isMember, participants: players, paymentIntentId: `pi_mock_${Date.now()}` });
      if ("error" in result) { setError(result.error.message); setConfirming(false); setTick(x=>x+1); return; }
      confirmedIds.push(result.booking.id);
    }
    setConfirming(false); setConfirmed(confirmedIds); setSelections([]); setTick(x=>x+1);
  }, [user, isMember, selections, players]);

  const onJoinWaitlist = useCallback(async () => {
    if (!user || !waitlistTarget) return;
    const r = await joinWaitlist({ courtId: waitlistTarget.courtId, slotStart: waitlistTarget.startsAt, userId: user.uid });
    if ("error" in r) setError(r.error.message);
    else setWaitlistConfirmed(waitlistTarget.key);
    setWaitlistTarget(null);
  }, [user, waitlistTarget]);

  // On regroupe les créneaux par horaire (et non par terrain) : l'utilisateur
  // choisit une heure, le système lui attribue un terrain disponible. Le prix
  // ne dépend que de la zone tarifaire de l'horaire (identique sur tous les
  // terrains d'un même sport), donc l'agrégation est sans perte d'info.
  const timeGroups = groupSlotsByTime(cells);

  const onPickGroup = useCallback((group: TimeGroup) => {
    const existing = selections.find(sel => sel.slot.startsAt.getTime() === group.time.getTime());
    if (existing) { onToggleSlot(existing.slot); return; }
    if (group.freeSlots.length > 0) { onToggleSlot(group.freeSlots[0]); return; }
    if (group.bookedSlot && user) { setError(null); setConfirmed(null); setWaitlistTarget(group.bookedSlot); }
  }, [selections, onToggleSlot, user]);

  const totalCents = selections.reduce((sum, sel) => sum + (sel.quote?.total.cents ?? 0), 0);
  const minRemainingMs = selections.filter(sel => sel.hold).reduce((min, sel) => Math.min(min, sel.remainingMs), Infinity);
  const hasHolds = selections.some(sel => sel.hold);
  const mm = Math.floor(minRemainingMs / 60_000);
  const ss = Math.floor((minRemainingMs % 60_000) / 1000);

  return (
    <div className={s.page}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem", marginBottom:"0" }}>
        <div>
          <p className={s.eyebrow}>Étape 01 / 03 · Choisis tes créneaux</p>
          <h1 className={s.title}>Réservation <em>en direct</em></h1>
          {!user && <p className={s.subtitle}>Tu peux explorer les disponibilités. <Link href="/connexion?next=/reservation">Connecte-toi</Link> pour réserver.</p>}
        </div>
        <div className={s.stepper}>
          {[["1 · Créneaux", selections.length>0], ["2 · Récap", hasHolds], ["3 · Paiement", !!confirmed]].map(([l, ok]) => (
            <span key={l as string} className={`${s.step} ${ok ? s.stepActive : ""}`}>{l as string}</span>
          ))}
        </div>
      </div>

      {/* How it works — 3-step guide */}
      <div className={s.howto}>
        <div className={s.howtoStep}>
          <span className={s.howtoNum}>1</span>
          <div>
            <div className={s.howtoTitle}>Choisis ton sport et ta date</div>
            <div className={s.howtoText}>Dans le panneau de gauche</div>
          </div>
        </div>
        <span className={s.howtoArrow}>→</span>
        <div className={s.howtoStep}>
          <span className={s.howtoNum}>2</span>
          <div>
            <div className={s.howtoTitle}>Clique sur un ou plusieurs créneaux libres</div>
            <div className={s.howtoText}>Sur le planning, au centre</div>
          </div>
        </div>
        <span className={s.howtoArrow}>→</span>
        <div className={s.howtoStep}>
          <span className={s.howtoNum}>3</span>
          <div>
            <div className={s.howtoTitle}>Vérifie le récap et paie</div>
            <div className={s.howtoText}>Dans le panneau de droite</div>
          </div>
        </div>
      </div>

      <div className={s.grid}>
        {/* Filters */}
        <aside>
          <p className={s.label}>Sport</p>
          <div style={{ display:"flex", flexDirection:"column", gap:".5rem" }}>
            {SPORT_TABS.map(sp => (
              <button key={sp.id} onClick={() => { setSport(sp.id); onClearAll(); }}
                className={`${s.sportTab} ${sport===sp.id ? s.sportTabActive : ""}`}>
                <div className={s.sportTabName}>{sp.label}<span className={s.sportTabCode}>{sp.code}</span></div>
                <div className={s.sportTabPrice}>dès {sp.price}€/h</div>
              </button>
            ))}
          </div>
          <p className={s.label} style={{ marginTop:"2rem" }}>Date</p>
          <MiniCalendar
            selected={selectedDate}
            onSelect={(d) => { setSelectedDate(d); onClearAll(); }}
          />
        </aside>

        {/* Grid */}
        <div>
          <div className={s.card}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:".75rem", marginBottom:".5rem" }}>
              <span className={s.cardTitle}>Créneaux disponibles — {sportData.label}</span>
            </div>
            <p className={s.tip}>↗ Astuce : sélectionne plusieurs horaires pour les réserver en une seule fois. Le terrain t'est attribué automatiquement à l'arrivée.</p>
            <div className={s.legend}>
              <span className={s.legendLabel}>Tarifs selon l'horaire&nbsp;:</span>
              <span className={s.legendChip}><span className={s.legendDot} style={{background:ZONE_COLORS.red}}/>{ZONE_LABELS.red} — 22€</span>
              <span className={s.legendChip}><span className={s.legendDot} style={{background:ZONE_COLORS.blue}}/>{ZONE_LABELS.blue} — 18€</span>
              <span className={s.legendChip}><span className={s.legendDot} style={{background:ZONE_COLORS.green}}/>{ZONE_LABELS.green} — 15€</span>
            </div>
            <SlotPicker groups={timeGroups} selections={selections} onPick={onPickGroup}/>
          </div>
          <div className={s.meta}>
            <span>Données live · refresh auto 15s</span>
            <span><span className={s.dot}/> {timeGroups.filter(g=>g.freeSlots.length>0).length} créneau{timeGroups.filter(g=>g.freeSlots.length>0).length>1?"x":""} disponible{timeGroups.filter(g=>g.freeSlots.length>0).length>1?"s":""}</span>
          </div>

          {error && <div className={s.alertError}><span className={s.alertTag} style={{color:"#e87060"}}>attention</span>{error}</div>}
          {waitlistConfirmed && <div className={s.alertError} style={{borderColor:"rgba(232,160,60,.3)",background:"rgba(232,160,60,.07)"}}><span className={s.alertTag} style={{color:"#e8a23c"}}>✓ File d'attente</span>Tu seras notifié(e) si le créneau se libère.</div>}
          {confirmed && (
            <div className={s.alertSuccess}>
              <span><span className={s.alertTag} style={{color:"var(--gold)"}}>✓ {confirmed.length} réservation{confirmed.length>1?"s":""} confirmée{confirmed.length>1?"s":""}</span></span>
              <Link href="/mon-compte#reservations" className={s.alertLink}>voir mes réservations →</Link>
            </div>
          )}
        </div>

        {/* Recap */}
        <div style={{ position:"sticky", top:"5rem", alignSelf:"start" }}>
          <div className={s.recap}>
            {selections.length === 0 ? (
              <>
                <p className={s.label} style={{margin:0,marginBottom:".75rem"}}>Récapitulatif</p>
                <div className={s.recapEmptyIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
                    <path d="M3 9.5h18M8 3v3M16 3v3" />
                    <path d="M8 14.5h2M13 14.5h2M8 18h2" />
                  </svg>
                </div>
                <p className={s.recapEmpty}>Ton récapitulatif apparaîtra ici dès que tu auras sélectionné un ou plusieurs créneaux libres sur le planning.</p>
                <p className={s.recapEmptyHint}>— Les cases vertes, bleues et rouges du planning sont disponibles, clique dessus pour les ajouter.</p>
              </>
            ) : (
              <>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:".75rem"}}>
                  <span className={s.label} style={{margin:0}}>{selections.length} créneau{selections.length>1?"x":""}</span>
                  <button onClick={onClearAll} style={{fontFamily:"var(--font-space-mono,monospace)",fontSize:".6rem",textTransform:"uppercase",letterSpacing:".15em",color:"rgba(242,237,228,.3)",background:"none",border:"none",cursor:"pointer"}} onMouseOver={e=>(e.currentTarget.style.color="#e87060")} onMouseOut={e=>(e.currentTarget.style.color="rgba(242,237,228,.3)")}>Vider</button>
                </div>
                <p className={s.recapAutoAssign}>↓ Le terrain est attribué automatiquement à ton arrivée — pas besoin de le choisir.</p>
                {hasHolds && isFinite(minRemainingMs) && (
                  <div className={s.holdTimer}><span className={s.holdDot}/>Hold · {String(mm).padStart(2,"0")}:{String(ss).padStart(2,"0")}</div>
                )}
                <div style={{display:"flex",flexDirection:"column",gap:".4rem",marginBottom:"1rem"}}>
                  {selections.map(sel => (
                    <div key={sel.slot.key} className={s.recapSlot}>
                      <div style={{flex:1,minWidth:0}}>
                        <div className={s.recapSlotCourt}>{sel.slot.zone ? ZONE_LABELS[sel.slot.zone] : sportData.label}</div>
                        <div className={s.recapSlotDate}>{sel.slot.startsAt.toLocaleString("fr-FR",{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</div>
                      </div>
                      <span className={s.recapSlotPrice}>{((sel.quote?.total.cents??0)/100).toFixed(0)}€</span>
                      <button onClick={()=>onToggleSlot(sel.slot)} className={s.recapRemove} aria-label="Retirer">
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 2L8 8M8 2L2 8"/></svg>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Players */}
                <p className={s.label}>Nombre de joueurs</p>
                <div className={s.playersRow}>
                  <button className={s.playerBtn} onClick={()=>setPlayers(p=>Math.max(1,p-1))} disabled={players<=1}>−</button>
                  <span className={s.playerCount}>{players}</span>
                  <button className={s.playerBtn} onClick={()=>setPlayers(p=>Math.min(sportData.maxPlayers,p+1))} disabled={players>=sportData.maxPlayers}>+</button>
                  <span className={s.playerMax}>/ {sportData.maxPlayers} max</span>
                </div>

                <div className={s.divider}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                  <span className={s.totalLabel}>Total</span>
                  <span className={s.totalValue}>{(totalCents/100).toFixed(2).replace(".",",")} €</span>
                </div>

                {!user ? (
                  <Link href="/connexion?next=/reservation" className={s.btnPrimary}>Se connecter pour réserver →</Link>
                ) : hasHolds ? (
                  <button onClick={onConfirmAll} disabled={confirming} className={s.btnPrimary}>{confirming?"Confirmation…":"Payer & confirmer →"}</button>
                ) : (
                  <p style={{fontFamily:"var(--font-space-mono,monospace)",fontSize:".65rem",color:"rgba(242,237,228,.3)",textAlign:"center",marginTop:".75rem"}}>Connecte-toi pour valider.</p>
                )}
                <p className={s.stripeNote}>Stripe · CB, Apple Pay, Google Pay</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Waitlist modal */}
      <Modal
        open={!!waitlistTarget}
        onClose={() => setWaitlistTarget(null)}
        title={<>Rejoindre la <em style={{color:"var(--gold)",fontStyle:"normal"}}>file d'attente</em> ?</>}
        actions={<>
          <button onClick={() => setWaitlistTarget(null)} style={{padding:".5rem 1.25rem",borderRadius:"2rem",fontSize:".82rem",background:"none",border:"none",cursor:"pointer",color:"rgba(242,237,228,.45)"}}>Non merci</button>
          <button onClick={onJoinWaitlist} className={s.btnPrimary} style={{width:"auto",marginTop:0,padding:".5rem 1.25rem"}}>S'inscrire →</button>
        </>}
      >
        {waitlistTarget && <p style={{fontSize:".875rem",color:"rgba(242,237,228,.65)",lineHeight:1.6}}>Ce créneau est déjà pris. Si tu rejoins la file, tu seras notifié(e) immédiatement si le créneau se libère, avec 10 min de priorité pour confirmer.</p>}
      </Modal>
    </div>
  );
}

/* ── Mini Calendar ── */
const WEEK_DAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function MiniCalendar({ selected, onSelect }: { selected: Date; onSelect: (d: Date) => void }) {
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date(selected); d.setDate(1); d.setHours(0,0,0,0); return d;
  });

  const prevMonth = () => setViewMonth(d => { const n = new Date(d); n.setMonth(n.getMonth()-1); return n; });
  const nextMonth = () => setViewMonth(d => { const n = new Date(d); n.setMonth(n.getMonth()+1); return n; });

  // Build grid: Mon-first, fill with nulls for padding
  const firstDay = new Date(viewMonth);
  const lastDay  = new Date(viewMonth.getFullYear(), viewMonth.getMonth()+1, 0);
  // Mon=0 … Sun=6
  const startPad = (firstDay.getDay() + 6) % 7;
  const days: (Date | null)[] = [
    ...Array(startPad).fill(null),
    ...Array.from({ length: lastDay.getDate() }, (_, i) => {
      const d = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i+1);
      return d;
    }),
  ];
  // Pad to complete last row
  while (days.length % 7 !== 0) days.push(null);

  const monthLabel = viewMonth.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  return (
    <div className={s.cal}>
      <div className={s.calNav}>
        <button className={s.calArrow} onClick={prevMonth} aria-label="Mois précédent">‹</button>
        <span className={s.calMonth}>{monthLabel}</span>
        <button className={s.calArrow} onClick={nextMonth} aria-label="Mois suivant">›</button>
      </div>
      <div className={s.calGrid}>
        {WEEK_DAYS.map(d => <div key={d} className={s.calWeekday}>{d}</div>)}
        {days.map((d, i) => {
          if (!d) return <div key={`pad-${i}`}/>;
          const isPast    = d < TODAY;
          const isToday   = sameDay(d, TODAY);
          const isSelected = sameDay(d, selected);
          return (
            <button
              key={d.toISOString()}
              disabled={isPast}
              onClick={() => !isPast && onSelect(d)}
              className={[
                s.calDay,
                isPast    ? s.calDayPast     : "",
                isToday   ? s.calDayToday    : "",
                isSelected ? s.calDaySelected : "",
              ].join(" ")}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Agrégation par horaire ──────────────────────────────────────────────
   Côté utilisateur, on ne réserve pas un terrain : on réserve une heure.
   On regroupe donc les slots de tous les terrains par horaire de départ,
   et on calcule la disponibilité globale pour cet horaire. */
type TimeGroup = {
  time: Date;
  zone: Slot["zone"];
  priceCents: number;
  freeSlots: Slot[];
  heldCount: number;
  blockedCount: number;
  bookedSlot: Slot | null;
  status: SlotStatus;
};

function groupSlotsByTime(cells: AvailabilityCell[]): TimeGroup[] {
  const rank: Record<SlotStatus, number> = { free: 0, held: 1, booked: 2, blocked: 3, past: 4, closed: 4 };
  const map = new Map<number, TimeGroup>();
  for (const cell of cells) {
    for (const slot of cell.slots) {
      const key = slot.startsAt.getTime();
      let g = map.get(key);
      if (!g) {
        g = { time: slot.startsAt, zone: slot.zone, priceCents: slot.priceCents, freeSlots: [], heldCount: 0, blockedCount: 0, bookedSlot: null, status: slot.status };
        map.set(key, g);
      }
      if (slot.status === "free") g.freeSlots.push(slot);
      else if (slot.status === "held") g.heldCount++;
      else if (slot.status === "booked" && !g.bookedSlot) g.bookedSlot = slot;
      else if (slot.status === "blocked") g.blockedCount++;
      if (rank[slot.status] < rank[g.status]) g.status = slot.status;
    }
  }
  return [...map.values()].sort((a, b) => a.time.getTime() - b.time.getTime());
}

function SlotPicker({ groups, selections, onPick }: { groups: TimeGroup[]; selections: SelectedSlot[]; onPick: (g: TimeGroup) => void }) {
  // Le clic sur un créneau "complet" ouvre toujours le flux de file d'attente
  // (qui invite à se connecter si besoin) — donc toujours cliquable visuellement.
  if (!groups.length) return <p className={s.tip}>Aucun horaire disponible pour cette date.</p>;
  return (
    <div className={s.slotGrid}>
      {groups.map(g => {
        const selected = selections.some(sel => sel.slot.startsAt.getTime() === g.time.getTime());
        const time = g.time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
        const price = (g.priceCents / 100).toFixed(0);
        const zoneC = g.zone ? ZONE_COLORS[g.zone] : null;

        let stateClass = s.slotPast;
        let label: string | null = null;
        let clickable = false;

        if (selected) {
          stateClass = s.slotSelected; label = "✓ Sélectionné"; clickable = true;
        } else if (g.freeSlots.length > 0) {
          stateClass = s.slotFree; label = `${g.freeSlots.length} créneau${g.freeSlots.length > 1 ? "x" : ""} dispo`; clickable = true;
        } else if (g.bookedSlot) {
          stateClass = s.slotBooked; label = "Complet · file d'attente"; clickable = true;
        } else if (g.heldCount > 0) {
          stateClass = s.slotHeld; label = "Réservation en cours"; clickable = false;
        } else if (g.blockedCount > 0) {
          stateClass = s.slotBlocked; label = "Indisponible"; clickable = false;
        } else {
          stateClass = s.slotPast; label = null; clickable = false;
        }

        return (
          <button
            key={g.time.toISOString()}
            disabled={!clickable}
            onClick={() => onPick(g)}
            className={`${s.slotCard} ${stateClass}`}
          >
            {zoneC && <span className={s.slotZoneBar} style={{ background: zoneC }} />}
            <span className={s.slotTime}>{time}</span>
            <span className={s.slotPrice}>{price} €</span>
            {label && <span className={s.slotState}>{label}</span>}
          </button>
        );
      })}
    </div>
  );
}
