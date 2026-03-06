"use client";

import { useState, useEffect } from "react";

const COOKIE_KEY = "eventsapp_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#e5e5e5] bg-white p-4 shadow-lg md:p-6">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 md:flex-row">
        <p className="flex-1 text-sm leading-relaxed text-[#525252]">
          Мы используем файлы cookie для корректной работы сайта и анализа
          трафика. Продолжая использование сайта, вы соглашаетесь с нашей{" "}
          <a
            href="/privacy"
            className="text-[#6366f1] underline underline-offset-2 hover:text-[#4f46e5]"
          >
            Политикой конфиденциальности
          </a>
          .
        </p>
        <button
          onClick={accept}
          className="shrink-0 rounded-lg bg-[#6366f1] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#4f46e5]"
        >
          Принять
        </button>
      </div>
    </div>
  );
}
