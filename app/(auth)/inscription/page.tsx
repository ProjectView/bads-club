"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import { AuthShell, Field, ErrorBox } from "@/components/auth/AuthShell";
import s from "@/components/auth/AuthShell.module.css";

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
      title={<>Bienvenue au <em>club.</em></>}
      subtitle="Crée ton compte en 30 secondes pour réserver, rejoindre des groupes et gérer ton abonnement."
      footer={
        <>
          <span>Déjà membre ?</span>
          <Link href="/connexion">Se connecter →</Link>
        </>
      }
    >
      {error && <ErrorBox message={error} />}

      <form onSubmit={onSubmit} className={s.fieldset}>
        <Field label="Nom complet" name="displayName" required autoComplete="name" placeholder="Léa Martin" />
        <Field label="Email" name="email" type="email" required autoComplete="email" placeholder="ton@email.fr" />
        <Field
          label="Téléphone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="06 12 34 56 78"
          hint="Optionnel — pour les confirmations de réservation par SMS."
        />

        <div className={s.fieldsetGrid}>
          <Field label="Mot de passe" name="password" type="password" required autoComplete="new-password" placeholder="••••••••" hint="8 caractères min." />
          <Field label="Confirmation" name="confirm" type="password" required autoComplete="new-password" placeholder="••••••••" />
        </div>

        <div>
          <span className={s.fieldLabel}>Sport favori</span>
          <div className={s.sportGrid}>
            {[
              { id: "badminton", label: "Badminton" },
              { id: "squash",    label: "Squash" },
              { id: "petanque",  label: "Pétanque" },
            ].map(sport => (
              <label key={sport.id} className={s.sportLabel}>
                <input type="radio" name="favoriteSport" value={sport.id} className={s.sportInput} />
                <div className={s.sportCard}>{sport.label}</div>
              </label>
            ))}
          </div>
        </div>

        <div className={s.fieldset} style={{ gap: '0.6rem' }}>
          <label className={s.checkRow}>
            <input type="checkbox" name="cgu" required />
            <span>
              J'accepte les{" "}
              <Link href="/cgu">conditions générales</Link>{" "}
              et la{" "}
              <Link href="/confidentialite">politique de confidentialité</Link>.
            </span>
          </label>
          <label className={s.checkRow}>
            <input type="checkbox" name="newsletter" defaultChecked />
            <span>Je veux recevoir la newsletter mensuelle (tournois, nouveautés du Lounge).</span>
          </label>
        </div>

        <button type="submit" disabled={loading} className={s.btnPrimary}>
          {loading ? "Création du compte…" : "Créer mon compte →"}
        </button>
      </form>
    </AuthShell>
  );
}
