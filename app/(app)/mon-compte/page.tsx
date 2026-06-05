"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import s from "./page.module.css";

type NotifPrefs = { inApp: boolean; email: boolean };
const STORAGE = "bads.notif.prefs";
const DEFAULT: NotifPrefs = { inApp: true, email: true };

export default function MonComptePage() {
  return <Suspense fallback={null}><Account /></Suspense>;
}

function Account() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const welcome = params.get("welcome") === "1";
  const error   = params.get("error");
  const [prefs, setPrefs] = useState<NotifPrefs>(DEFAULT);

  useEffect(() => {
    try { setPrefs({ ...DEFAULT, ...JSON.parse(localStorage.getItem(STORAGE) ?? "{}") }); } catch {}
  }, []);

  function togglePref(key: keyof NotifPrefs) {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    localStorage.setItem(STORAGE, JSON.stringify(next));
  }

  if (!user) return (
    <div style={{ maxWidth:"28rem", margin:"6rem auto", padding:"0 1.5rem", textAlign:"center" }}>
      <p style={{ fontFamily:"var(--font-space-mono,monospace)", fontSize:".8rem", color:"rgba(242,237,228,.35)" }}>Chargement…</p>
    </div>
  );

  async function onLogout() { await signOut(); router.push("/"); }

  return (
    <div className={s.page}>
      {welcome && (
        <div className={s.bannerSuccess}>
          <span style={{ fontSize:"2rem" }}>🎉</span>
          <div>
            <div className={s.bannerTitle}>Bienvenue {user.displayName.split(" ")[0]} !</div>
            <div className={s.bannerSub}>Ton compte est créé. Tu peux maintenant réserver et rejoindre des groupes.</div>
          </div>
        </div>
      )}
      {error === "admin-required" && (
        <div className={s.bannerError}><span className={s.bannerTag}>accès refusé</span>Cette section est réservée à l'équipe Bad's Club.</div>
      )}

      <div className={s.grid}>
        {/* Sidebar */}
        <aside className={s.sidebar}>
          <div className={s.profileCard}>
            <div className={s.avatar}>{user.displayName.slice(0,1).toUpperCase()}</div>
            <div className={s.profileName}>{user.displayName}</div>
            <div className={s.profileEmail}>{user.email}</div>
            <div className={s.badge}><span className={s.badgeDot}/>{user.role==="admin"?"Admin Bad's":"Membre actif"}</div>
            <nav className={s.navMenu}>
              {[["Réservations","#reservations"],["Mes groupes","#groupes"],["Abonnement","#abonnement"],["Notifications","#notifications"]].map(([l,h]) => (
                <a key={l} href={h} className={s.navItem}>{l}</a>
              ))}
              {user.role==="admin" && <Link href="/admin" className={`${s.navItem} ${s.navAdmin}`}>→ Espace admin</Link>}
              <div className={s.navDivider}/>
              <button onClick={onLogout} className={`${s.navItem} ${s.navLogout}`}>Se déconnecter</button>
            </nav>
          </div>
        </aside>

        {/* Main */}
        <div className={s.main}>
          <div>
            <p className={s.eyebrow}>Tableau de bord</p>
            <h1 className={s.title}>Salut {user.displayName.split(" ")[0]} <span className={s.titleGold}>↗</span></h1>
          </div>

          {/* Stats */}
          <div className={s.statsGrid}>
            {[["12","sessions ce mois"],["3","groupes actifs"],["180€","dépensé · 2026"],["−20%","tarif membre"]].map(([k,l]) => (
              <div key={l} className={s.statCard}>
                <div className={s.statNum}>{k}</div>
                <div className={s.statLabel}>{l}</div>
              </div>
            ))}
          </div>

          {/* Reservations */}
          <div id="reservations" className={s.card}>
            <div className={s.cardHead}>
              <div>
                <div className={s.cardTitle}>Mes réservations</div>
                <div className={s.cardSub}>3 à venir</div>
              </div>
              <Link href="/reservation" className={s.btnGold}>+ Réserver</Link>
            </div>
            {[
              ["Jeu. 22 mai","19h00 → 20h00","Badminton · BAD—02","confirmé"],
              ["Sam. 24 mai","10h00 → 11h00","Squash · SQS—04","confirmé"],
              ["Lun. 26 mai","20h00 → 21h00","Badminton · BAD—01","en attente"],
            ].map(([d,h,t,st], i) => (
              <div key={i} className={s.resa}>
                <div>
                  <div className={s.resaName}>{t}</div>
                  <div className={s.resaDate}>{d} · {h}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:".75rem" }}>
                  <span className={st==="confirmé" ? s.tagConfirm : s.tagPending}>{st}</span>
                  <button className={s.cancelBtn}>Annuler</button>
                </div>
              </div>
            ))}
          </div>

          {/* Groups */}
          <div id="groupes" className={s.card}>
            <div className={s.cardHead}>
              <div className={s.cardTitle}>Mes groupes</div>
              <Link href="/communaute" className={s.linkGold}>Tous →</Link>
            </div>
            <div className={s.cardBody}>
              <div className={s.groupsGrid}>
                {[["Double mixte du jeudi","🏸","14 membres","double-mixte-jeudi"],["Squash After-Work","🎾","23 membres","squash-after-work"],["Pétanque Lounge","🥖","31 membres","petanque-club-lounge"]].map(([n,e,m,id]) => (
                  <Link key={id as string} href={`/communaute/${id}`} className={s.groupCard}>
                    <div className={s.groupEmoji}>{e}</div>
                    <div className={s.groupName}>{n}</div>
                    <div className={s.groupMeta}>{m}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div id="abonnement" className={s.subCard}>
            <div className={s.subInner}>
              <div>
                <p className={s.subTag}>Adhésion Bad's · Active</p>
                <div className={s.subName}>Formule Annuelle</div>
                <div className={s.subDesc}>Tarifs membres −20%, accès prioritaire aux tournois, 4 invités gratuits par mois.</div>
                <div className={s.subExpiry}>Prochaine échéance · 11 mars 2027 · 240€/an</div>
              </div>
              <div className={s.subActions}>
                <button className={s.btnGhost}>Gérer mon abonnement</button>
                <button className={s.btnGhost}>Moyen de paiement</button>
              </div>
            </div>
          </div>

          {/* Notification prefs */}
          <div id="notifications" className={s.notifCard}>
            <div className={s.cardHead}>
              <div>
                <div className={s.cardTitle}>Notifications</div>
                <div className={s.cardSub}>Comment tu veux être prévenu(e) ?</div>
              </div>
            </div>
            {[
              { key:"inApp", label:"Notifications dans l'app", sub:"Toast + cloche dans la barre de nav", tag:"actif", tagColor:"var(--gold)" },
              { key:"email", label:"Email", sub:`Envoyés à ${user.email} via Brevo`, tag:"actif", tagColor:"var(--gold)" },
            ].map(({ key, label, sub, tag, tagColor }) => (
              <div key={key} className={s.notifRow}>
                <div>
                  <div className={s.notifLabel}>
                    {label}
                    <span className={s.notifTag} style={{ background:`${tagColor}18`, color:tagColor }}>{tag}</span>
                  </div>
                  <div className={s.notifSub}>{sub}</div>
                </div>
                <button onClick={() => togglePref(key as keyof NotifPrefs)}
                  className={`${s.switch} ${prefs[key as keyof NotifPrefs] ? s.switchOn : s.switchOff}`}
                  role="switch" aria-checked={prefs[key as keyof NotifPrefs]}>
                  <span className={`${s.switchThumb} ${prefs[key as keyof NotifPrefs] ? s.switchThumbOn : s.switchThumbOff}`}/>
                </button>
              </div>
            ))}
            <div className={s.notifRow}>
              <div>
                <div className={s.notifLabel}>SMS <span className={s.notifTag} style={{background:"rgba(242,237,228,.06)",color:"rgba(242,237,228,.3)"}}>fallback critique</span></div>
                <div className={s.notifSub}>{user.phone ? `Envoyés au ${user.phone}` : "Renseigne ton tél dans le profil pour activer"}</div>
              </div>
              <span style={{fontFamily:"var(--font-space-mono,monospace)",fontSize:".6rem",color:"rgba(242,237,228,.25)"}}>auto</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
