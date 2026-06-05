"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordReset } from "@/lib/auth";
import { AuthShell, Field, ErrorBox } from "@/components/auth/AuthShell";
import s from "@/components/auth/AuthShell.module.css";

export default function ResetPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await sendPasswordReset(String(fd.get("email")));
      setSent(true);
    } catch (err) {
      setError((err as { message?: string })?.message ?? "Envoi impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Sécurité · Réinitialisation"
      title={<>Mot de passe <em>oublié ?</em></>}
      subtitle={sent ? undefined : "Indique ton email, on t'envoie un lien de réinitialisation."}
      footer={<Link href="/connexion">← Retour à la connexion</Link>}
    >
      {sent ? (
        <div className={s.success}>
          <span className={s.successTag}>✓ Email envoyé</span>
          <p style={{ fontSize: '0.875rem', color: 'rgba(242,237,228,0.7)', lineHeight: 1.65, margin: 0 }}>
            Si un compte existe avec cet email, tu recevras dans les prochaines minutes
            un lien pour définir un nouveau mot de passe. Pense à vérifier tes spams.
          </p>
        </div>
      ) : (
        <>
          {error && <ErrorBox message={error} />}
          <form onSubmit={onSubmit} className={s.fieldset}>
            <Field label="Email" name="email" type="email" required placeholder="ton@email.fr" />
            <button type="submit" disabled={loading} className={s.btnPrimary}>
              {loading ? "Envoi…" : "Envoyer le lien →"}
            </button>
          </form>
        </>
      )}
    </AuthShell>
  );
}
