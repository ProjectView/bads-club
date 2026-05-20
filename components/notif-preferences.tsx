"use client";

import { useEffect, useState } from "react";

type Prefs = { inApp: boolean; email: boolean };

const STORAGE = "bads.notif.prefs";
const DEFAULT: Prefs = { inApp: true, email: true };

function loadPrefs(): Prefs {
  if (typeof window === "undefined") return DEFAULT;
  try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem(STORAGE) ?? "{}") }; }
  catch { return DEFAULT; }
}
function savePrefs(p: Prefs) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE, JSON.stringify(p));
}

export function NotifPreferences({ email, phone }: { email: string; phone?: string }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT);

  useEffect(() => { setPrefs(loadPrefs()); }, []);

  function update(patch: Partial<Prefs>) {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    savePrefs(next);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] overflow-hidden">
      <div className="px-6 py-5 border-b border-white/10">
        <div className="font-display text-2xl">Mes notifications</div>
        <div className="text-xs font-mono text-[var(--color-muted)] mt-1">Comment tu veux être prévenu(e) ?</div>
      </div>

      <div className="divide-y divide-white/5">
        <Row
          title="Notifications dans l'app"
          subtitle="Toast qui apparaît quand tu es sur l'app · cloche dans la barre de nav"
          tag="actif"
          tagColor="#d6ff3e"
          checked={prefs.inApp}
          onToggle={() => update({ inApp: !prefs.inApp })}
        />
        <Row
          title="Push mobile (PWA installée)"
          subtitle="Une fois l'app installée sur ton écran d'accueil, tu reçois les notifs même app fermée"
          tag="dispo en prod"
          tagColor="#3498db"
          checked={true}
          onToggle={() => {}}
          disabled
        />
        <Row
          title="Email"
          subtitle={`Envoyés à ${email} via Brevo`}
          tag="actif"
          tagColor="#d6ff3e"
          checked={prefs.email}
          onToggle={() => update({ email: !prefs.email })}
        />
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">SMS</span>
                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 text-[var(--color-muted)]">
                  fallback critique
                </span>
              </div>
              <div className="text-xs text-[var(--color-muted)] mt-0.5">
                {phone ? `Envoyés au ${phone} via Brevo — rappel 30 min si push indispo` : "Renseigne ton tél dans le profil pour activer"}
              </div>
            </div>
            <span className="text-xs font-mono text-[var(--color-muted)]">auto</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 border-t border-white/10 text-[10px] font-mono text-[var(--color-muted)]">
        Rappel 30 min envoyé sur le canal le plus rapide dispo (push &gt; SMS &gt; email).
      </div>
    </div>
  );
}

function Row({
  title, subtitle, tag, tagColor, checked, onToggle, disabled,
}: {
  title: string; subtitle: string; tag: string; tagColor: string;
  checked: boolean; onToggle: () => void; disabled?: boolean;
}) {
  return (
    <div className="px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium">{title}</span>
          <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: `${tagColor}15`, color: tagColor }}>
            {tag}
          </span>
        </div>
        <div className="text-xs text-[var(--color-muted)] mt-0.5">{subtitle}</div>
      </div>
      <Switch checked={checked} onToggle={onToggle} disabled={disabled} />
    </div>
  );
}

function Switch({ checked, onToggle, disabled }: { checked: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      role="switch"
      aria-checked={checked}
      className={`relative w-11 h-6 rounded-full transition-colors disabled:opacity-50 ${
        checked ? "bg-[var(--color-lime)]" : "bg-white/10"
      }`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-[var(--color-ink)] transition-transform ${
        checked ? "translate-x-[22px]" : "translate-x-0.5"
      }`} />
    </button>
  );
}
