"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import { AuthShell, Field, ErrorBox } from "@/components/auth-shell";

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
      title={<>Content de te <em className="text-[var(--color-lime)]">revoir.</em></>}
      subtitle="Connecte-toi pour réserver un terrain, rejoindre un groupe ou gérer le club."
      footer={
        <div className="flex items-center justify-between text-[var(--color-muted)]">
          <span>Pas encore membre ?</span>
          <Link href="/inscription" className="text-[var(--color-lime)] hover:underline">
            Créer un compte →
          </Link>
        </div>
      }
    >
      {error && <ErrorBox message={error} />}
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email" name="email" type="email" required autoComplete="email" placeholder="ton@email.fr" />
        <Field label="Mot de passe" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-[var(--color-muted)] cursor-pointer">
            <input type="checkbox" name="remember" defaultChecked className="accent-[var(--color-lime)]" />
            Garder ma session
          </label>
          <Link href="/mot-de-passe-oublie" className="text-[var(--color-muted)] hover:text-[var(--color-lime)]">
            Mot de passe oublié ?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-lime w-full py-3.5 rounded-full font-medium disabled:opacity-60 disabled:cursor-wait"
        >
          {loading ? "Connexion…" : "Se connecter →"}
        </button>

        <div className="relative my-6 text-center">
          <span className="bg-[var(--color-ink)] px-3 text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted)] relative z-10">
            ou
          </span>
          <div className="absolute left-0 right-0 top-1/2 border-t border-white/10 -z-0" />
        </div>

        <button type="button" className="btn-ghost w-full py-3.5 rounded-full font-medium flex items-center justify-center gap-3">
          <GoogleIcon /> Continuer avec Google
        </button>
      </form>

      <div className="mt-8 rounded-xl border border-dashed border-white/10 p-4 text-xs font-mono text-[var(--color-muted)]">
        <div className="text-[10px] uppercase tracking-widest text-[var(--color-lime)] mb-2">démo · comptes test</div>
        <div className="space-y-0.5">
          <div>admin@badsclub.com · admin <span className="text-[var(--color-muted)]/60">(rôle admin)</span></div>
          <div>lea@example.com · demo <span className="text-[var(--color-muted)]/60">(rôle membre)</span></div>
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
