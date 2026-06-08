import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth-context";
import { PwaProvider } from "@/components/pwa-provider";
import { InstallPrompt } from "@/components/install-prompt";
import { ToastHost } from "@/components/toast-host";
import { ChatWidget } from "@/components/chatbot/ChatWidget";

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
  themeColor: "#080808",
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
      <body>
        <AuthProvider>
          <PwaProvider />
          {children}
          <ToastHost />
          <InstallPrompt />
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}

