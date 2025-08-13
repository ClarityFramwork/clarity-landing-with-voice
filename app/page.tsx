"use client";

import { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react';

/**
 * Custom hook to handle dark mode toggling by adding/removing a `dark` class
 * on the document element. Dark mode state persists for the duration of
 * the session.
 */
function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return { isDark, setIsDark } as const;
}

/**
 * A simple voice-enabled chat widget. It supports text input and voice
 * recognition via the Web Speech API on compatible browsers. When the user
 * submits a message, the assistant echoes back the input prefaced with
 * "Response:". Speech synthesis reads replies aloud.
 */
function ChatAgent() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [recognizer, setRecognizer] = useState<any>(null);
  const [listening, setListening] = useState(false);

  // Initialize speech recognition once on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSubmit(transcript);
      };
      rec.onend = () => setListening(false);
      setRecognizer(rec);
    }
  }, []);

  /**
   * Dummy reply handler. In a real application you would replace this with a
   * network call to your backend or OpenAI API. It simply echoes the
   * user's message.
   */
  async function reply(message: string): Promise<string> {
    return `Response: ${message}`;
  }

  async function handleSubmit(forcedMessage?: string) {
    const query = forcedMessage ?? input.trim();
    if (!query) return;
    setMessages((prev) => [...prev, query]);
    setInput('');
    const response = await reply(query);
    setMessages((prev) => [...prev, response]);
    // Speak the assistant's reply
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(response);
      window.speechSynthesis.speak(utterance);
    }
  }

  function startListening() {
    if (recognizer) {
      setListening(true);
      recognizer.start();
    }
  }

  return (
    <div id="chat" className="w-full max-w-lg mx-auto border border-zinc-300 dark:border-zinc-700 rounded-xl p-4 bg-zinc-50 dark:bg-zinc-900 shadow-inner">
      <div className="h-44 overflow-y-auto mb-3 space-y-2">
        {messages.map((msg, idx) => (
          <p
            key={idx}
            className={
              idx % 2 === 0
                ? 'text-zinc-800 dark:text-zinc-200 font-medium'
                : 'text-indigo-600 dark:text-indigo-400'
            }
          >
            {msg}
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
          placeholder="Type a message"
          className="flex-grow px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
        />
        <button
          onClick={() => handleSubmit()}
          className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={startListening}
          disabled={listening}
          className="inline-flex items-center justify-center bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          {listening ? 'Listening…' : 'Voice'}
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  const { isDark, setIsDark } = useDarkMode();

  return (
    <>
      {/* Top navigation bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-semibold text-lg">Clarity Agent Suite</span>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#features" className="hover:text-indigo-600">
              Features
            </a>
            <a href="#get-clarity" className="hover:text-indigo-600">
              Pricing
            </a>
            <a
              href="https://chatgpt.com/c/689cb32a-935c-8324-beb2-3874b1566018"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600"
            >
              Read the Docs
            </a>
          </nav>
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4 py-24 relative overflow-hidden">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            Empower Your Workflow
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 text-zinc-600 dark:text-zinc-400">
            Automate and accelerate your business with the Clarity Agent Suite. Intelligent agents deliver insights, automate tasks, and give you clarity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a
              href="#get-clarity"
              className="px-6 py-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg"
            >
              Get Clarity
            </a>
            <a
              href="https://chatgpt.com/c/689cb32a-935c-8324-beb2-3874b1566018"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-zinc-800"
            >
              Read the Docs
            </a>
          </div>
          {/* Chat widget inside hero */}
          <ChatAgent />
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-4 bg-zinc-100 dark:bg-zinc-900">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Powerful Features</h2>
            <p className="text-lg mb-12 text-zinc-600 dark:text-zinc-400">
              Explore the suite of tools designed to supercharge your productivity.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Real‑time Insights</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Harness AI to turn data into actionable intelligence and stay ahead.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Your data remains protected with enterprise‑grade security built in.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Effortless Integration</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Easily connect with your existing tools via our robust API and plugins.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="get-clarity" className="py-24 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-lg mb-8 text-zinc-600 dark:text-zinc-400">
              Join the Clarity revolution today and see what our agents can do for you.
            </p>
            <a
              href="#"
              className="px-8 py-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg"
            >
              Sign Up
            </a>
          </div>
        </section>
      </main>

      {/* Sticky CTA bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-6 py-3 shadow-xl">
        <a
          href="#chat"
          className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500"
        >
          Chat with Clarity
        </a>
        <a
          href="#get-clarity"
          className="px-4 py-2 rounded-full bg-zinc-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          Get Clarity
        </a>
      </div>
    </>
  );
}
