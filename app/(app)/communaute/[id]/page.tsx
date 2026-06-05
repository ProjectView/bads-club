import Link from "next/link";
import { GROUPS, MESSAGES } from "@/lib/mock";
import s from "./page.module.css";

const COLORS = ["#bda41a","#ff8a3c","#f4ede0","#a8d423","#c14d2a"];

export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const group = GROUPS.find(g => g.id === id) ?? GROUPS[0];

  return (
    <div className={s.page}>
      <Link href="/communaute" className={s.back}>← Communauté</Link>

      {/* Hero */}
      <div className={s.hero}>
        <div className={s.heroInner}>
          <div className={s.heroLeft}>
            <span className={s.heroEmoji}>{group.avatar}</span>
            <div>
              <p className={s.heroTag}>{group.sport} · {group.members} membres</p>
              <h1 className={s.heroName}>{group.name}</h1>
              <p className={s.heroNext}>Prochaine session : <strong>{group.next}</strong></p>
            </div>
          </div>
          <div className={s.heroActions}>
            <Link href="/reservation" className={s.btnPrimary}>Réserver pour le groupe →</Link>
            <button className={s.btnSecondary}>Quitter le groupe</button>
          </div>
        </div>
      </div>

      <div className={s.layout}>
        {/* Chat */}
        <div className={s.chat}>
          <div className={s.chatHead}>
            <div>
              <div className={s.chatTitle}>Discussion</div>
              <div className={s.chatStatus}><span className={s.chatDot}/>3 membres en ligne · sync Firestore</div>
            </div>
            <div className={s.chatAvatars}>
              {["LM","AR","SB","MD","TM"].map((a,i) => (
                <div key={i} className={s.chatAvatar} style={{background:COLORS[i]}}>{a}</div>
              ))}
            </div>
          </div>

          <div className={s.chatMessages}>
            <span className={s.chatDay}>Aujourd'hui</span>
            {MESSAGES.map((m, i) => (
              <div key={i} className={`${s.msg} ${m.you ? s.msgReverse : ""}`}>
                <div className={s.msgAvatar} style={{background: m.you ? "var(--gold)" : COLORS[i % COLORS.length]}}>
                  {m.avatar}
                </div>
                <div className={s.msgBody}>
                  <div className={s.msgMeta}>
                    <span className={s.msgFrom}>{m.from}</span>
                    <span className={s.msgTime}>{m.time}</span>
                  </div>
                  <div className={`${s.msgBubble} ${m.you ? s.msgBubbleYou : s.msgBubbleOther}`}>{m.text}</div>
                </div>
              </div>
            ))}
            <div className={s.bookingEmbed}>
              <p className={s.bookingTag}>↳ Léa M. a réservé un terrain</p>
              <div className={s.bookingName}>Badminton · BAD—02</div>
              <div className={s.bookingDate}>Jeu. 22 mai · 19h00 → 20h00 · 4 places restantes</div>
              <button className={s.bookingJoin}>Je participe (3/8)</button>
            </div>
          </div>

          <div className={s.chatInput}>
            <input className={s.chatField} placeholder="Écris un message au groupe…"/>
            <button className={s.chatSend}>↑</button>
          </div>
        </div>

        {/* Sidebar */}
        <div className={s.sidebar}>
          <div className={s.sideCard}>
            <p className={s.sideLabel}>Prochaines sessions</p>
            {[["Jeu. 22 mai","19h00 · Terrain 2",true],["Jeu. 29 mai","19h00 · Terrain 3",false],["Jeu. 5 juin","19h00 · À booker",false]].map(([d,h,live],i) => (
              <div key={i} className={s.session}>
                <div>
                  <div className={s.sessionDate}>{d as string}</div>
                  <div className={s.sessionInfo}>{h as string}</div>
                </div>
                <span className={live ? s.tagConfirm : s.tagPending}>{live?"confirmé":"en attente"}</span>
              </div>
            ))}
          </div>

          <div className={s.sideCard}>
            <p className={s.sideLabel}>Stats du groupe</p>
            <div className={s.statsGrid}>
              {[["48","sessions"],["92%","présence"],["9","réguliers"],["11/24","créé le"]].map(([v,l]) => (
                <div key={l} className={s.stat}>
                  <div className={s.statNum}>{v}</div>
                  <div className={s.statLabel}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
