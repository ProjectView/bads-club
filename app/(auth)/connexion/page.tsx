"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import { AuthShell, Field, ErrorBox } from "@/components/auth/AuthShell";
import s from "@/components/auth/AuthShell.module.css";

export default function ConnexionPage() {
  return (
    <Suspense fallback={null}>
      <ConnexionForm />
    </Suspense>
  );
}

function ConnexionForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/mon-compte";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const user = await signIn(String(fd.get("email")), String(fd.get("password")));
      router.push(user.role === "admin" ? (next.startsWith("/admin") ? next : "/admin") : next);
    } catch (err) {
      setError((err as { message?: string })?.message ?? "Connexion impossible.");
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Espace membre & admin"
      title={<>Content de te <em>revoir.</em></>}
      subtitle="Connecte-toi pour réserver un terrain, rejoindre un groupe ou gérer le club."
      footer={
        <>
          <span>Pas encore membre ?</span>
          <Link href="/inscription">Créer un compte →</Link>
        </>
      }
    >
      {error && <ErrorBox message={error} />}

      <form onSubmit={onSubmit} className={s.fieldset}>
        <Field label="Email" name="email" type="email" required autoComplete="email" placeholder="ton@email.fr" />
        <Field label="Mot de passe" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" />

        <div className={s.formMeta}>
          <label className={s.checkRow} style={{ gap: '0.5rem' }}>
            <input type="checkbox" name="remember" defaultChecked />
            <span>Garder ma session</span>
          </label>
          <Link href="/mot-de-passe-oublie" className={s.formMetaLink}>
            Mot de passe oublié ?
          </Link>
        </div>

        <button type="submit" disabled={loading} className={s.btnPrimary}>
          {loading ? "Connexion…" : "Se connecter →"}
        </button>

        <div className={s.divider}>
          <span className={s.dividerText}>ou</span>
        </div>

        <button type="button" className={s.btnSecondary}>
          <GoogleIcon /> Continuer avec Google
        </button>
      </form>

      <div className={s.demo}>
        <span className={s.demoTag}>démo · comptes test</span>
        <div className={s.demoLine}>
          admin@badsclub.com · admin <span style={{ opacity: 0.5 }}>(rôle admin)</span><br />
          lea@example.com · demo <span style={{ opacity: 0.5 }}>(rôle membre)</span>
        </div>
      </div>
    </AuthShell>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4-5.5 4-3.3 0-6-2.7-6-6.1S8.7 5.9 12 5.9c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-2H12z"/>
    </svg>
  );
}
