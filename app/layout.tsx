import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { AuthProvider } from "@/components/auth-context";
import { PwaProvider } from "@/components/pwa-provider";
import { InstallPrompt } from "@/components/install-prompt";
import { DemoBanner } from "@/components/demo-banner";
import { ToastHost } from "@/components/toast-host";

export const metadata: Metadata = {
  title: "Bad's Club — Sport & Lounge depuis 1999",
  description: "Badminton, squash, pétanque, bar-restaurant. Lyon 7ème.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Bad's",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [{ url: "/icon-192.svg", type: "image/svg+xml" }],
    apple: "/icon-192.svg",
  },
};

export const viewport = {
  themeColor: "#0b0f1a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain min-h-screen">
        <AuthProvider>
          <PwaProvider />
          <DemoBanner />
          <Nav />
          <main>{children}</main>
          <ToastHost />
          <InstallPrompt />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="mt-32 border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 grid grid-cols-2 lg:grid-cols-5 gap-10 text-sm">
        <div className="col-span-2">
          <div className="font-display text-3xl mb-3">Bad&apos;s Club</div>
          <p className="text-[var(--color-muted)] leading-relaxed mb-4">
            Sport &amp; Lounge depuis 1999.<br/>
            1 500 m² au cœur de Lyon 7ème.
          </p>
          <div className="flex gap-3 mt-4">
            <SocialIcon label="Instagram" href="#" />
            <SocialIcon label="Facebook" href="#" />
            <SocialIcon label="LinkedIn" href="#" />
          </div>
        </div>
        <div>
          <div className="font-mono uppercase text-xs tracking-widest text-[var(--color-muted)] mb-3">Adresse</div>
          <p className="leading-relaxed">43 rue Garibaldi<br/>69007 Lyon<br/>Métro Jean Macé</p>
        </div>
        <div>
          <div className="font-mono uppercase text-xs tracking-widest text-[var(--color-muted)] mb-3">Horaires</div>
          <p className="leading-relaxed">Lun—Ven · 10h → 22h45<br/>Sam—Dim · 09h → 19h30</p>
        </div>
        <div>
          <div className="font-mono uppercase text-xs tracking-widest text-[var(--color-muted)] mb-3">Légal</div>
          <ul className="space-y-1.5">
            <li><a href="/mentions-legales" className="hover:text-[var(--color-lime)]">Mentions légales</a></li>
            <li><a href="/cgu" className="hover:text-[var(--color-lime)]">CGU</a></li>
            <li><a href="/confidentialite" className="hover:text-[var(--color-lime)]">Confidentialité</a></li>
            <li><a href="mailto:contact@badsclub.com" className="hover:text-[var(--color-lime)]">contact@badsclub.com</a></li>
            <li><a href="tel:0472715050" className="hover:text-[var(--color-lime)]">04 72 71 50 50</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 px-6 lg:px-12 text-xs font-mono text-[var(--color-muted)] flex flex-wrap items-center justify-between gap-2 max-w-[1400px] mx-auto">
        <span>© 2026 Bad&apos;s Club · Tous droits réservés</span>
        <span>Maquette ProjectView · Adelin × Bernard</span>
      </div>
    </footer>
  );
}

function SocialIcon({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} aria-label={label}
      className="w-9 h-9 rounded-full border border-white/10 hover:border-[var(--color-lime)] grid place-items-center text-[var(--color-muted)] hover:text-[var(--color-lime)] transition">
      <span className="font-mono text-[10px]">{label.slice(0, 2).toUpperCase()}</span>
    </a>
  );
}
