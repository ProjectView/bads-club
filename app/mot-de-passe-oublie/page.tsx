"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordReset } from "@/lib/auth";
import { AuthShell, Field, ErrorBox } from "@/components/auth-shell";

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
      title={<>Mot de passe <em className="text-[var(--color-lime)]">oublié</em> ?</>}
      subtitle={sent ? undefined : "Indique ton email, on t'envoie un lien de réinitialisation."}
      footer={
        <Link href="/connexion" className="text-[var(--color-lime)] hover:underline">
          ← Retour à la connexion
        </Link>
      }
    >
      {sent ? (
        <div className="border border-[var(--color-lime)]/40 bg-[var(--color-lime)]/5 rounded-2xl p-6">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-lime)] mb-2">
            ✓ Email envoyé
          </div>
          <p className="text-sm">
            Si un compte existe avec cet email, tu recevras dans les prochaines minutes un lien
            pour définir un nouveau mot de passe. Pense à vérifier tes spams.
          </p>
        </div>
      ) : (
        <>
          {error && <ErrorBox message={error} />}
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Email" name="email" type="email" required placeholder="ton@email.fr" />
            <button
              type="submit"
              disabled={loading}
              className="btn-lime w-full py-3.5 rounded-full font-medium disabled:opacity-60"
            >
              {loading ? "Envoi…" : "Envoyer le lien"}
            </button>
          </form>
        </>
      )}
    </AuthShell>
  );
}
