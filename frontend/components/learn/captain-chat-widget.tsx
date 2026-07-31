"use client";

import Link from "next/link";
import { Mic, Square } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { CaptainMascot } from "@/components/learn/captain-mascot";
import { useSitePreferences } from "@/components/site/site-preferences";
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

const CAPTAIN21_NAME = "Captain21";

const STARTER_PROMPT_FALLBACK = `Hi! I'm ${CAPTAIN21_NAME}. Ask me about Love 21 programmes, volunteering, or how to get involved.`;

const BUBBLE_PROMPT_KEYS = ["captainBubbleQuestions", "captainBubbleCurious", "captainBubbleVolunteer"] as const;
const BUBBLE_PROMPT_FALLBACKS = [
  "Do you have any questions?",
  "Curious about what we do?",
  "Do you want to volunteer?",
];
const BUBBLE_DISMISSED_KEY = "love21-captain-bubble-dismissed";
const BUBBLE_INITIAL_DELAY_MS = 4500;
const BUBBLE_ROTATE_MS = 5500;

export function CaptainChatWidget() {
  const ui = useLearnUi();
  const { t, i18n } = useTranslation("learn");
  const { speechLang, locale, a11y } = useSitePreferences();
  const dialogTitleId = useId();
  const inputId = useId();
  const liveRegionId = useId();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterText = t("ui.captainStarter", {
    name: CAPTAIN21_NAME,
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
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [bubbleIndex, setBubbleIndex] = useState(0);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const captainOpenAria = mounted
    ? t("ui.captainOpenAria", { defaultValue: "Ask Captain21" })
    : "Ask Captain21";

  const floatClass = a11y.reduceMotion
    ? ""
    : "motion-safe:animate-[captain-float_3.2s_ease-in-out_infinite]";

  const bubblePrompt = mounted
    ? t(`ui.${BUBBLE_PROMPT_KEYS[bubbleIndex]}`, {
        defaultValue: BUBBLE_PROMPT_FALLBACKS[bubbleIndex],
      })
    : BUBBLE_PROMPT_FALLBACKS[bubbleIndex];

  const dismissBubble = useCallback(() => {
    setBubbleVisible(false);
    setBubbleDismissed(true);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(BUBBLE_DISMISSED_KEY, "1");
    }
  }, []);

  const openChat = useCallback(() => {
    setBubbleVisible(false);
    setBubbleDismissed(true);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(BUBBLE_DISMISSED_KEY, "1");
    }
    setOpen(true);
  }, []);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && window.sessionStorage.getItem(BUBBLE_DISMISSED_KEY)) {
      setBubbleDismissed(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted || open || bubbleDismissed) return undefined;
    const showTimer = window.setTimeout(() => setBubbleVisible(true), BUBBLE_INITIAL_DELAY_MS);
    return () => window.clearTimeout(showTimer);
  }, [mounted, open, bubbleDismissed]);

  useEffect(() => {
    if (!bubbleVisible || open) return undefined;
    const rotateTimer = window.setInterval(() => {
      setBubbleIndex((index) => (index + 1) % BUBBLE_PROMPT_KEYS.length);
    }, BUBBLE_ROTATE_MS);
    return () => window.clearInterval(rotateTimer);
  }, [bubbleVisible, open]);

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
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          {mounted && bubbleVisible && (
            <div
              key={bubbleIndex}
              className="relative max-w-[15rem] animate-[fadeUp_0.35s_ease-out]"
            >
              <button
                type="button"
                onClick={openChat}
                className="block w-full rounded-2xl border border-brand-sand bg-white px-4 py-3 text-left text-sm font-medium leading-snug text-brand-ink shadow-lg transition hover:border-brand-coral/40 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral"
              >
                {bubblePrompt}
              </button>
              <button
                type="button"
                onClick={dismissBubble}
                className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border border-brand-sand bg-white text-xs text-brand-ink/50 shadow-sm hover:text-brand-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral"
                aria-label={ui("captainDismissBubble", "Dismiss")}
              >
                ✕
              </button>
              <span
                className="absolute -bottom-2 right-8 h-4 w-4 rotate-45 border-b border-r border-brand-sand bg-white"
                aria-hidden="true"
              />
            </div>
          )}
          <button
            type="button"
            onClick={openChat}
            className={`group rounded-full border-0 bg-transparent p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral focus-visible:ring-offset-2 ${floatClass}`}
            aria-label={captainOpenAria}
          >
            <CaptainMascot
              mood="happy"
              outfit="default"
              size={76}
              label={captainOpenAria}
              className="pointer-events-none transition group-hover:drop-shadow-[0_14px_22px_rgba(144,0,0,0.28)]"
            />
          </button>
        </div>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
          className="fixed bottom-6 right-6 z-50 flex h-[min(32rem,85vh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-brand-sand bg-white shadow-2xl"
        >
          <header className="flex items-center justify-between gap-3 border-b border-brand-sand bg-brand-ink px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <CaptainMascot mood="happy" outfit="athlete" size={44} label="" />
              <div>
                <h2 id={dialogTitleId} className="text-sm font-semibold">
                  {CAPTAIN21_NAME}
                </h2>
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
            <div className="relative">
              <textarea
                id={inputId}
                ref={inputRef}
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder={ui("chatPlaceholder", "Ask about programmes, volunteering, or how to get involved…")}
                className="w-full resize-none rounded-xl border border-brand-sand py-2 pl-3 pr-11 text-sm text-brand-ink placeholder:text-brand-ink/40 focus:border-brand-coral focus:outline-none focus:ring-2 focus:ring-brand-coral/30 disabled:opacity-60"
              />
              {speechSupported && (
                <button
                  type="button"
                  onClick={listening ? stopListening : startListening}
                  disabled={loading}
                  aria-pressed={listening}
                  aria-label={listening ? ui("captainStopVoice", "Stop voice input") : ui("captainStartVoice", "Start voice input")}
                  className={`absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral disabled:cursor-not-allowed disabled:opacity-40 ${
                    listening
                      ? "bg-brand-coral/15 text-brand-coral"
                      : "text-brand-ink/45 hover:bg-brand-cream hover:text-brand-coral"
                  }`}
                >
                  {listening ? (
                    <Square className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                  ) : (
                    <Mic className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              )}
            </div>
            {!speechSupported && (
              <p className="mt-1 text-[11px] text-brand-ink/45">{ui("voiceNeedsChrome", "Voice input needs Chrome or Edge")}</p>
            )}
            <div className="mt-2 flex justify-end">
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
