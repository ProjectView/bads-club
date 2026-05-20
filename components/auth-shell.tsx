import Link from "next/link";

export function AuthShell({
  eyebrow, title, subtitle, children, footer,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Left — visual */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-[var(--color-ink-2)] to-[var(--color-ink-3)] p-12 flex-col justify-between">
        <div className="absolute inset-0 court-lines opacity-40" />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[var(--color-lime)] opacity-[0.07] blur-3xl" />
        <div className="relative">
          <Link href="/" className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
            ← Bad&apos;s Club
          </Link>
        </div>
        <div className="relative">
          <div className="font-display text-6xl xl:text-7xl leading-[0.95]">
            Le club qui<br/>
            <em className="text-[var(--color-lime)]">se joue en ligne</em>.
          </div>
          <p className="mt-6 text-[var(--color-cream-dim)] max-w-md">
            Réserve un terrain en 30 secondes, retrouve tes partenaires, organise ta prochaine
            partie. Un compte, tous les sports.
          </p>
        </div>
        <div className="relative grid grid-cols-3 gap-4">
          {[["13", "terrains"], ["420+", "membres"], ["1 500", "m²"]].map(([k, l]) => (
            <div key={l}>
              <div className="font-display text-4xl text-[var(--color-lime)]">{k}</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted)]">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-3">
            {eyebrow}
          </div>
          <h1 className="font-display text-5xl lg:text-6xl leading-[1] tracking-tight mb-3">
            {title}
          </h1>
          {subtitle && <p className="text-[var(--color-cream-dim)] mb-8">{subtitle}</p>}
          {children}
          {footer && <div className="mt-8 text-sm">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

export function Field({
  label, name, type = "text", required, placeholder, autoComplete, defaultValue, hint,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  defaultValue?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-1.5">
        {label} {required && <span className="text-[var(--color-lime)]">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        className="w-full bg-[var(--color-ink-2)] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-lime)] transition-colors"
      />
      {hint && <span className="block text-[10px] text-[var(--color-muted)] mt-1.5">{hint}</span>}
    </label>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="border border-[var(--color-clay)]/40 bg-[var(--color-clay)]/10 text-[var(--color-cream)] text-sm rounded-xl px-4 py-3 mb-5">
      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-amber)] mr-2">erreur</span>
      {message}
    </div>
  );
}
