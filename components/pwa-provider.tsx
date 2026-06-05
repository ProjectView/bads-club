"use client";

import { useEffect } from "react";

/**
 * Enregistre le service worker dès le chargement.
 * Idempotent : si déjà enregistré, met juste à jour.
 */
export function PwaProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (location.protocol === "http:" && location.hostname !== "localhost") return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        // Force la mise à jour côté serveur quand l'app revient au premier plan
        reg.update().catch(() => {});
      })
      .catch((err) => console.warn("[pwa] service worker registration failed", err));
  }, []);

  return null;
}
