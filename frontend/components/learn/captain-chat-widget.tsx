"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { CaptainMascot } from "@/components/learn/captain-mascot";
import { useSitePreferences } from "@/components/site/site-preferences";
import { captainMeta } from "@/lib/captain-character";
import { api, type CaptainChatMessage } from "@/lib/api";
import { useLearnUi } from "@/lib/i18n/translated-data";

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

function getSpeechRecognition(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const STARTER_PROMPT_FALLBACK = `Hi! I'm ${captainMeta.fullName}. Ask me about Love 21 programmes, volunteering, myths vs facts, or how to get involved.`;

export function CaptainChatWidget() {
  const ui = useLearnUi();
  const { t, i18n } = useTranslation("learn");
  const { speechLang, locale } = useSitePreferences();
  const dialogTitleId = useId();
  const dialogDescId = useId();
  const inputId = useId();
  const liveRegionId = useId();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterText = t("ui.captainStarter", {
    name: captainMeta.fullName,
    defaultValue: STARTER_PROMPT_FALLBACK,
  });

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<CaptainChatMessage[]>([
    {
      role: "assistant",
      content: STARTER_PROMPT_FALLBACK,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const chatOpenLabel = mounted ? ui("chatOpen", "Ask Captain21") : "Ask Captain21";
  const captainOpenAria = mounted
    ? t("ui.captainOpenAria", { defaultValue: "Ask Captain21" })
    : "Ask Captain21";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setMessages((prev) => {
      const isStarterOnly =
        prev.length === 1 && prev[0].role === "assistant" && !prev[0].links;
      if (!isStarterOnly) return prev;
      return [{ role: "assistant", content: starterText }];
    });
  }, [mounted, starterText, i18n.language]);

  useEffect(() => {
    setSpeechSupported(getSpeechRecognition() !== null);
  }, []);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!open) {
      recognitionRef.current?.stop();
      setListening(false);
    }
  }, [open]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognitionCtor = getSpeechRecognition();
    if (!SpeechRecognitionCtor || loading) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = speechLang;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }, [loading, speechLang]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: CaptainChatMessage = { role: "user", content: text };
    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setInput("");
    setError(null);
    setLoading(true);
    stopListening();

    try {
      const history = messages.filter((m) => m.role === "user" || m.role === "assistant").slice(-8);
      const response = await api.captainChat({ message: text, history, locale });
      setMessages([
        ...nextHistory,
        {
          role: "assistant",
          content: response.reply,
          links: response.links,
        },
      ]);
      if (response.message && !response.enabled) {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : ui("captainReachError", "Could not reach Captain 21. Is the backend running?"));
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border-2 border-brand-ink bg-brand-coral px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral focus-visible:ring-offset-2"
          aria-label={captainOpenAria}
        >
          <CaptainMascot mood="happy" outfit="default" size={36} label="" />
          <span className="hidden sm:inline">{chatOpenLabel}</span>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
          aria-describedby={dialogDescId}
          className="fixed bottom-5 right-5 z-50 flex h-[min(32rem,85vh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-brand-sand bg-white shadow-2xl"
        >
          <header className="flex items-center justify-between gap-3 border-b border-brand-sand bg-brand-ink px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <CaptainMascot mood="happy" outfit="athlete" size={44} label="" />
              <div>
                <h2 id={dialogTitleId} className="text-sm font-semibold">
                  {captainMeta.fullName}
                </h2>
                <p id={dialogDescId} className="text-xs text-white/65">
                  {ui("captainRole", "Inclusion coach · powered by local Ollama")}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full px-2 py-1 text-sm text-white/80 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={ui("closeChat", "Close chat")}
            >
              ✕
            </button>
          </header>

          <div
            className="flex-1 space-y-3 overflow-y-auto bg-brand-cream/40 px-3 py-4"
            aria-label={ui("captainChatMessages", "Chat messages")}
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "ml-auto bg-brand-coral text-white"
                    : "mr-auto border border-brand-sand bg-white text-brand-ink"
                }`}
              >
                <p>{message.content}</p>
                {message.links && message.links.length > 0 && (
                  <ul className="mt-2 space-y-2" aria-label={ui("captainSuggestedPages", "Suggested pages")}>
                    {message.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="block rounded-xl border border-brand-coral/25 bg-brand-coral/5 px-3 py-2 transition hover:border-brand-coral hover:bg-brand-coral/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral"
                        >
                          <span className="font-semibold text-brand-coral">{link.title}</span>
                          <span className="mt-0.5 block text-xs text-brand-ink/65">{link.description}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {loading && (
              <p className="text-sm text-brand-ink/55" aria-live="polite">
                {ui("captainThinking", "Captain 21 is thinking…")}
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <p id={liveRegionId} role="alert" className="border-t border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              {error}
            </p>
          )}

          <footer className="border-t border-brand-sand bg-white p-3">
            <label htmlFor={inputId} className="sr-only">
              {ui("captainMessageLabel", "Message to Captain 21")}
            </label>
            <textarea
              id={inputId}
              ref={inputRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder={ui("chatPlaceholder", "Ask about programmes, volunteering, or myths…")}
              className="w-full resize-none rounded-xl border border-brand-sand px-3 py-2 text-sm text-brand-ink placeholder:text-brand-ink/40 focus:border-brand-coral focus:outline-none focus:ring-2 focus:ring-brand-coral/30 disabled:opacity-60"
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              {speechSupported ? (
                <button
                  type="button"
                  onClick={listening ? stopListening : startListening}
                  disabled={loading}
                  aria-pressed={listening}
                  aria-label={listening ? ui("captainStopVoice", "Stop voice input") : ui("captainStartVoice", "Start voice input")}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral ${
                    listening
                      ? "border-brand-coral bg-brand-coral/10 text-brand-coral"
                      : "border-brand-sand text-brand-ink/70 hover:border-brand-coral/40"
                  }`}
                >
                  {listening ? ui("listening", "Listening…") : ui("captainSpeakEmoji", "🎤 Speak")}
                </button>
              ) : (
                <span className="text-[11px] text-brand-ink/45">{ui("voiceNeedsChrome", "Voice input needs Chrome or Edge")}</span>
              )}
              <button
                type="button"
                onClick={() => void sendMessage()}
                disabled={loading || !input.trim()}
                className="rounded-full bg-brand-coral px-4 py-2 text-xs font-semibold text-white hover:bg-brand-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral disabled:cursor-not-allowed disabled:opacity-40"
              >
                {ui("send", "Send")}
              </button>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
