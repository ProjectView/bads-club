"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import { AuthShell, Field, ErrorBox } from "@/components/auth-shell";

export default function InscriptionPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password"));
    const confirm = String(fd.get("confirm"));
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    if (!fd.get("cgu")) {
      setError("Tu dois accepter les conditions d'utilisation pour créer un compte.");
      return;
    }

    setLoading(true);
    try {
      await signUp({
        displayName: String(fd.get("displayName")),
        email: String(fd.get("email")),
        password,
        phone: String(fd.get("phone") || ""),
        favoriteSport: (fd.get("favoriteSport") || undefined) as "badminton" | "squash" | "petanque" | undefined,
        newsletter: !!fd.get("newsletter"),
      });
      router.push("/mon-compte?welcome=1");
    } catch (err) {
      setError((err as { message?: string })?.message ?? "Inscription impossible.");
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Adhésion · 100% en ligne"
      title={<>Bienvenue au <em className="text-[var(--color-lime)]">club.</em></>}
      subtitle="Crée ton compte en 30 secondes pour réserver, rejoindre des groupes et gérer ton abonnement."
      footer={
        <div className="flex items-center justify-between text-[var(--color-muted)]">
          <span>Déjà membre ?</span>
          <Link href="/connexion" className="text-[var(--color-lime)] hover:underline">
            Se connecter →
          </Link>
        </div>
      }
    >
      {error && <ErrorBox message={error} />}
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nom complet" name="displayName" required autoComplete="name" placeholder="Léa Martin" />
        <Field label="Email" name="email" type="email" required autoComplete="email" placeholder="ton@email.fr" />
        <Field label="Téléphone" name="phone" type="tel" autoComplete="tel" placeholder="06 12 34 56 78" hint="Optionnel — utilisé pour les confirmations de réservation par SMS." />

        <div className="grid grid-cols-2 gap-3">
          <Field label="Mot de passe" name="password" type="password" required autoComplete="new-password" placeholder="••••••••" hint="8 caractères min." />
          <Field label="Confirmation" name="confirm" type="password" required autoComplete="new-password" placeholder="••••••••" />
        </div>

        <div>
          <span className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-2">
            Sport favori
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "badminton", label: "Badminton" },
              { id: "squash", label: "Squash" },
              { id: "petanque", label: "Pétanque" },
            ].map(s => (
              <label key={s.id} className="cursor-pointer">
                <input type="radio" name="favoriteSport" value={s.id} className="peer sr-only" />
                <div className="text-center py-3 rounded-xl border border-white/10 bg-[var(--color-ink-2)] text-sm peer-checked:border-[var(--color-lime)] peer-checked:bg-[var(--color-lime)] peer-checked:text-[var(--color-ink)] transition-all">
                  {s.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <label className="flex items-start gap-3 text-xs text-[var(--color-cream-dim)] cursor-pointer">
            <input type="checkbox" name="cgu" required className="accent-[var(--color-lime)] mt-0.5" />
            <span>J'accepte les <Link href="#" className="underline">conditions générales</Link> et la <Link href="#" className="underline">politique de confidentialité</Link>.</span>
          </label>
          <label className="flex items-start gap-3 text-xs text-[var(--color-cream-dim)] cursor-pointer">
            <input type="checkbox" name="newsletter" defaultChecked className="accent-[var(--color-lime)] mt-0.5" />
            <span>Je veux recevoir la newsletter mensuelle (tournois, nouveautés du Lounge).</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-lime w-full py-3.5 rounded-full font-medium disabled:opacity-60 disabled:cursor-wait"
        >
          {loading ? "Création du compte…" : "Créer mon compte →"}
        </button>
      </form>
    </AuthShell>
  );
}
