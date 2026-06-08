"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import { findPerson, describePerson, getBotReply } from "@/lib/chatbot/engine";
import s from "./ChatWidget.module.css";

type Message = { id: string; from: "bot" | "user"; text: string };

let seq = 0;
function nextId() {
  seq += 1;
  return `m${seq}`;
}

function IconChat(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 5.5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9.5L5 20v-3.5H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z" />
      <path d="M8 10h8M8 13h5" />
    </svg>
  );
}

function IconClose(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function IconSend(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 12 20 5l-6 16-2.5-7L4 12Z" />
    </svg>
  );
}

export function ChatWidget() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [knownName, setKnownName] = useState<string | null>(null);
  const [awaitingName, setAwaitingName] = useState(false);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Si l'utilisateur est connecté, le bot le sait dès le départ — comme un
  // conseiller qui consulte le dossier client avant de répondre.
  useEffect(() => {
    if (user?.displayName && !knownName) {
      const cleanName = user.displayName.split("·")[0].trim();
      setKnownName(cleanName);
    }
  }, [user, knownName]);

  useEffect(() => {
    if (open && messages.length === 0) {
      const greetingTarget = user?.displayName ? user.displayName.split("·")[0].trim() : null;
      const person = greetingTarget ? findPerson(greetingTarget) : null;
      const text = person
        ? `Bonjour ${person.name.split(" ")[0]} ! Ravi de vous revoir. ${describePerson(person)}`
        : greetingTarget
          ? `Bonjour ${greetingTarget.split(" ")[0]} ! Je suis l'assistant de Bad's Club — horaires, tarifs, bar, réservations… posez-moi vos questions.`
          : `Bonjour et bienvenue chez Bad's Club 👋 Je peux répondre à vos questions (horaires, tarifs, sports, bar…) et, si vous me dites votre nom, retrouver votre prochaine réservation.`;
      setMessages([{ id: nextId(), from: "bot", text }]);
    }
  }, [open, messages.length, user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const userMsg: Message = { id: nextId(), from: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    // Petite latence simulée pour rendre la conversation plus naturelle.
    setTimeout(() => {
      const reply = getBotReply(text, { knownName, awaitingName });
      if (reply.learnedName) setKnownName(reply.learnedName);
      setAwaitingName(!!reply.asksForName);
      setMessages(prev => [...prev, { id: nextId(), from: "bot", text: reply.text }]);
      setTyping(false);
    }, 420 + Math.random() * 380);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  // Pas d'assistant flottant sur le kiosque de commande au bar (expérience focalisée, sans nav).
  if (pathname?.startsWith("/commander")) return null;

  return (
    <>
      <button
        className={s.fab}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant"}
        aria-expanded={open}
      >
        {open ? <IconClose className="w-5 h-5" /> : <IconChat className="w-5 h-5" />}
        {!open && <span className={s.fabLabel}>Besoin d&apos;aide ?</span>}
      </button>

      {open && (
        <div className={s.panel} role="dialog" aria-label="Assistant Bad's Club">
          <div className={s.header}>
            <div>
              <div className={s.headerEyebrow}>Bad&apos;s Club · Assistant</div>
              <div className={s.headerTitle}>{knownName ? `À votre service, ${knownName.split(" ")[0]}` : "Comment vous aider ?"}</div>
            </div>
            <button className={s.headerClose} onClick={() => setOpen(false)} aria-label="Fermer">
              <IconClose className="w-4 h-4" />
            </button>
          </div>

          <div className={s.messages} ref={scrollRef}>
            {messages.map(m => (
              <div key={m.id} className={`${s.bubbleRow} ${m.from === "user" ? s.bubbleRowUser : ""}`}>
                <div className={`${s.bubble} ${m.from === "user" ? s.bubbleUser : s.bubbleBot}`}>
                  {m.text.split("\n").map((line, i) => <p key={i} className={s.bubbleLine}>{line}</p>)}
                </div>
              </div>
            ))}
            {typing && (
              <div className={s.bubbleRow}>
                <div className={`${s.bubble} ${s.bubbleBot} ${s.bubbleTyping}`}>
                  <span className={s.dot} /><span className={s.dot} /><span className={s.dot} />
                </div>
              </div>
            )}
          </div>

          <div className={s.composer}>
            <textarea
              className={s.input}
              placeholder={knownName ? "Écrivez votre message…" : "Dites-moi votre nom, ou posez votre question…"}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
            />
            <button className={s.send} onClick={send} aria-label="Envoyer" disabled={!input.trim()}>
              <IconSend className="w-4 h-4" />
            </button>
          </div>
          <p className={s.disclaimer}>
            Assistant de démo basé sur des règles &amp; données fictives — pas encore connecté à une vraie IA.
          </p>
        </div>
      )}
    </>
  );
}
