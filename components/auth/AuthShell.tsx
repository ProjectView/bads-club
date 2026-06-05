import Link from "next/link";
import s from "./AuthShell.module.css";

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
    <div className={s.shell}>
      {/* Left — visual */}
      <div className={s.visual}>
        <div className={s.visualTop}>
          <Link href="/" className={s.backLink}>← Bad's Club</Link>
        </div>
        <div className={s.visualMid}>
          <h2 className={s.visualTitle}>
            Le club qui<br />
            <em>se joue en ligne.</em>
          </h2>
          <p className={s.visualBody}>
            Réserve un terrain en 30 secondes, retrouve tes partenaires,
            organise ta prochaine partie. Un compte, tous les sports.
          </p>
        </div>
        <div className={s.visualStats}>
          {[["13", "terrains"], ["420+", "membres"], ["1 500", "m²"]].map(([k, l]) => (
            <div key={l} className={s.stat}>
              <div className={s.statNum}>{k}</div>
              <div className={s.statLabel}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className={s.form}>
        <div className={s.formInner}>
          <p className={s.eyebrow}>{eyebrow}</p>
          <h1 className={s.title}>{title}</h1>
          {subtitle && <p className={s.subtitle}>{subtitle}</p>}
          {children}
          {footer && <div className={s.footer}>{footer}</div>}
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
    <label className={s.field}>
      <span className={s.fieldLabel}>
        {label} {required && <span className={s.required}>*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        className={s.input}
      />
      {hint && <span className={s.hint}>{hint}</span>}
    </label>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className={s.error}>
      <span className={s.errorTag}>erreur</span>
      {message}
    </div>
  );
}
