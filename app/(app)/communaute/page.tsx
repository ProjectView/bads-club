import Link from "next/link";
import { GROUPS } from "@/lib/mock";
import s from "./page.module.css";

const COLORS = ["#bda41a","#ff8a3c","#f4ede0","#a8d423","#c14d2a"];
const FILTERS = ["Tous les groupes","Badminton","Squash","Pétanque","Compétition","Débutants","Mes groupes"];

export default function CommunautePage() {
  return (
    <div className={s.page}>
      <div className={s.header}>
        <div>
          <p className={s.eyebrow}>Communauté Bad's · 420 adhérents actifs</p>
          <h1 className={s.title}>Les <em>groupes</em> qui font<br/>vivre le club.</h1>
        </div>
        <div className={s.actions}>
          <button className={s.btnPrimary}>+ Créer un groupe</button>
          <button className={s.btnSecondary}>Rechercher un partenaire</button>
        </div>
      </div>

      <div className={s.filters}>
        {FILTERS.map((f, i) => (
          <button key={f} className={`${s.filter} ${i===0 ? s.filterActive : ""}`}>{f}</button>
        ))}
      </div>

      <div className={s.grid}>
        {GROUPS.map((g, i) => (
          <Link key={g.id} href={`/communaute/${g.id}`} className={s.groupCard}>
            <div className={s.groupTop}>
              <span className={s.groupEmoji}>{g.avatar}</span>
              <span className={s.groupSport}>{g.sport}</span>
            </div>
            <div className={s.groupName}>{g.name}</div>
            <div className={s.groupMeta}>
              <span>{g.members} membres</span>
              <span>·</span>
              <span>{g.next}</span>
            </div>
            <div className={s.avatarRow}>
              {Array.from({length:5}).map((_,k) => (
                <div key={k} className={s.avatarBubble} style={{background:COLORS[(i+k)%COLORS.length]}}>
                  {String.fromCharCode(65+((i+k)%26))}
                </div>
              ))}
              <span className={s.avatarMore}>+{g.members-5}</span>
            </div>
            <div className={s.groupLast}>« {g.last} »</div>
            <div className={s.activityBar}>
              <div className={s.activityHead}><span>activité 7j</span><span>{g.activity}%</span></div>
              <div className={s.activityTrack}><div className={s.activityFill} style={{width:`${g.activity}%`}}/></div>
            </div>
          </Link>
        ))}
        <div className={s.createCard}>
          <span className={s.createIcon}>＋</span>
          <div className={s.createTitle}>Crée ton groupe</div>
          <p className={s.createSub}>Rassemble tes partenaires, fixe un créneau récurrent, réservez ensemble.</p>
        </div>
      </div>
    </div>
  );
}
