"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-context";
import { Modal } from "@/components/modal";
import { getAvailability, createHold, confirmHold, releaseHold, getQuote, joinWaitlist, type AvailabilityCell } from "@/lib/booking/service";
import { SPORTS } from "@/lib/booking/config";
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
              <span className={s.cardTitle}>Planning — {sportData.label}</span>
              <div className={s.legend}>
                <span><span className={s.legendDot} style={{background:"#e74c3c"}}/> Rouge 22€</span>
                <span><span className={s.legendDot} style={{background:"#3498db"}}/> Bleue 18€</span>
                <span><span className={s.legendDot} style={{background:"#27ae60"}}/> Verte 15€</span>
                <span style={{color:"rgba(242,237,228,.2)"}}>·</span>
                <span><span style={{display:"inline-block",width:"10px",height:"10px",borderRadius:"2px",background:"var(--gold)",marginRight:".3rem"}}/>choisi</span>
              </div>
            </div>
            <p className={s.tip}>↗ Clique sur plusieurs créneaux pour les réserver en une seule fois.</p>
            <GridView cells={cells} selectedKeys={new Set(selections.map(sel=>sel.slot.key))} onToggle={onToggleSlot}/>
          </div>
          <div className={s.meta}>
            <span>Données live · refresh auto 15s</span>
            <span><span className={s.dot}/> {cells.length} terrain{cells.length>1?"s":""}</span>
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
                <p className={s.label} style={{margin:0,marginBottom:".5rem"}}>Récapitulatif</p>
                <p className={s.recapEmpty}>Clique sur un ou plusieurs créneaux libres pour les ajouter à ta réservation.</p>
              </>
            ) : (
              <>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:".75rem"}}>
                  <span className={s.label} style={{margin:0}}>{selections.length} créneau{selections.length>1?"x":""}</span>
                  <button onClick={onClearAll} style={{fontFamily:"var(--font-space-mono,monospace)",fontSize:".6rem",textTransform:"uppercase",letterSpacing:".15em",color:"rgba(242,237,228,.3)",background:"none",border:"none",cursor:"pointer"}} onMouseOver={e=>(e.currentTarget.style.color="#e87060")} onMouseOut={e=>(e.currentTarget.style.color="rgba(242,237,228,.3)")}>Vider</button>
                </div>
                {hasHolds && isFinite(minRemainingMs) && (
                  <div className={s.holdTimer}><span className={s.holdDot}/>Hold · {String(mm).padStart(2,"0")}:{String(ss).padStart(2,"0")}</div>
                )}
                <div style={{display:"flex",flexDirection:"column",gap:".4rem",marginBottom:"1rem"}}>
                  {selections.map(sel => (
                    <div key={sel.slot.key} className={s.recapSlot}>
                      <div style={{flex:1,minWidth:0}}>
                        <div className={s.recapSlotCourt}>{sel.slot.courtId}</div>
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

function GridView({ cells, selectedKeys, onToggle }: { cells: AvailabilityCell[]; selectedKeys: Set<string>; onToggle: (s: Slot) => void }) {
  const times = cells[0]?.slots.map(sl => sl.startsAt) ?? [];
  return (
    <div className={s.gridWrap}>
      <div className={s.gridInner}>
        <div style={{ display:"grid", gap:"3px", gridTemplateColumns:`80px repeat(${times.length},minmax(30px,1fr))` }}>
          <div/>
          {times.map((t,i) => <div key={i} className={s.timeHeader}>{t.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}</div>)}
          {cells.map(cell => (
            <GridRow key={cell.courtId} cell={cell} selectedKeys={selectedKeys} onToggle={onToggle}/>
          ))}
        </div>
      </div>
    </div>
  );
}

function GridRow({ cell, selectedKeys, onToggle }: { cell: AvailabilityCell; selectedKeys: Set<string>; onToggle: (s: Slot) => void }) {
  const zoneColor = { red:"#e74c3c", blue:"#3498db", green:"#27ae60" };
  return (
    <>
      <div style={{paddingTop:"4px"}}>
        <div className={s.courtId}>{cell.courtId}</div>
        <div className={s.courtLabel}>{cell.courtLabel}</div>
      </div>
      {cell.slots.map(slot => {
        const isSelected = selectedKeys.has(slot.key);
        const zoneC = slot.zone ? zoneColor[slot.zone] : null;
        if (slot.status==="past"||slot.status==="closed") return (
          <div key={slot.key} className={`${s.cell} ${s.cellPast}`}>·
            {zoneC && <span className={s.zoneBar} style={{background:zoneC,opacity:.2}}/>}
          </div>
        );
        if (slot.status==="booked") return (
          <button key={slot.key} onClick={()=>onToggle(slot)} title="Pris · rejoindre la file" className={`${s.cell} ${s.cellBooked}`}>—
            {zoneC && <span className={s.zoneBar} style={{background:zoneC,opacity:.3}}/>}
          </button>
        );
        if (slot.status==="held") return (
          <div key={slot.key} className={`${s.cell} ${s.cellHeld}`}>⌛
            {zoneC && <span className={s.zoneBar} style={{background:zoneC,opacity:.3}}/>}
          </div>
        );
        if (slot.status==="blocked") return <div key={slot.key} className={`${s.cell} ${s.cellBlocked}`}>⊘</div>;
        const price = (slot.priceCents/100).toFixed(0);
        return (
          <button key={slot.key} onClick={()=>onToggle(slot)} title={`${slot.zone?`Zone ${slot.zone} · `:""}${price}€`}
            className={`${s.cell} ${isSelected ? s.cellSelected : s.cellFree}`}>
            {isSelected?"✓":price}
            {zoneC && <span className={s.zoneBar} style={{background:zoneC,opacity:isSelected?.4:.6}}/>}
          </button>
        );
      })}
    </>
  );
}
