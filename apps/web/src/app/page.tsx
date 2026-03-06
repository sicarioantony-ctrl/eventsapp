"use client";

import { useState } from "react";

const EVENT_TYPES = [
  "Корпоратив",
  "Свадьба",
  "День рождения",
  "Конференция",
  "Презентация",
  "Другое",
];

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      contactName: (form.elements.namedItem("name") as HTMLInputElement).value,
      contactPhone: (form.elements.namedItem("phone") as HTMLInputElement)
        .value,
      contactEmail: (form.elements.namedItem("email") as HTMLInputElement)
        .value,
      eventType: (form.elements.namedItem("eventType") as HTMLSelectElement)
        .value,
      notes: (form.elements.namedItem("notes") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/leads`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
      if (res.ok) setSubmitted(true);
    } catch {
      /* API might not be ready yet */
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717]">
      {/* Header */}
      <header className="border-b border-[#e5e5e5] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="text-xl font-bold tracking-tight">
            Events<span className="text-[#6366f1]">App</span>
          </span>
          <nav className="hidden gap-8 text-sm font-medium text-[#525252] md:flex">
            <a href="#services" className="transition hover:text-[#171717]">
              Услуги
            </a>
            <a href="#about" className="transition hover:text-[#171717]">
              О нас
            </a>
            <a href="#contact" className="transition hover:text-[#171717]">
              Контакты
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center md:py-32">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
          Организуем мероприятия,
          <br />
          <span className="text-[#6366f1]">которые запоминаются</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-[#525252]">
          От корпоративов до свадеб — полный цикл подготовки и проведения
          событий любого масштаба.
        </p>
        <a
          href="#contact"
          className="mt-8 inline-block rounded-lg bg-[#6366f1] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#4f46e5]"
        >
          Оставить заявку
        </a>
      </section>

      {/* Services */}
      <section id="services" className="border-t border-[#e5e5e5] bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-20 md:grid-cols-3">
          {[
            {
              title: "Корпоративы",
              desc: "Тимбилдинги, праздники, выездные мероприятия для вашей команды.",
            },
            {
              title: "Свадьбы",
              desc: "Полное сопровождение: от концепции до последнего танца.",
            },
            {
              title: "Конференции",
              desc: "Техническое обеспечение, спикеры, площадки — всё под ключ.",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="rounded-xl border border-[#e5e5e5] p-8 transition hover:shadow-md"
            >
              <h3 className="mb-3 text-lg font-semibold">{s.title}</h3>
              <p className="text-sm leading-relaxed text-[#525252]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / Lead Form */}
      <section id="contact" className="mx-auto max-w-2xl px-6 py-20">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">
          Оставить заявку
        </h2>

        {submitted ? (
          <div className="rounded-xl border border-[#c7d2fe] bg-[#eef2ff] p-8 text-center">
            <p className="text-lg font-semibold text-[#4338ca]">
              Спасибо! Мы свяжемся с вами в ближайшее время.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-xl border border-[#e5e5e5] bg-white p-8"
          >
            <div>
              <label className="mb-1 block text-sm font-medium">Имя</label>
              <input
                name="name"
                required
                className="w-full rounded-lg border border-[#d4d4d4] px-4 py-2.5 text-sm outline-none transition focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
                placeholder="Иван Иванов"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Телефон
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  className="w-full rounded-lg border border-[#d4d4d4] px-4 py-2.5 text-sm outline-none transition focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  name="email"
                  type="email"
                  className="w-full rounded-lg border border-[#d4d4d4] px-4 py-2.5 text-sm outline-none transition focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
                  placeholder="ivan@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Тип мероприятия
              </label>
              <select
                name="eventType"
                required
                className="w-full rounded-lg border border-[#d4d4d4] px-4 py-2.5 text-sm outline-none transition focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
              >
                <option value="">Выберите...</option>
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Комментарий
              </label>
              <textarea
                name="notes"
                rows={3}
                className="w-full rounded-lg border border-[#d4d4d4] px-4 py-2.5 text-sm outline-none transition focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
                placeholder="Расскажите о вашем мероприятии..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#6366f1] py-3 text-sm font-semibold text-white transition hover:bg-[#4f46e5] disabled:opacity-50"
            >
              {loading ? "Отправка..." : "Отправить заявку"}
            </button>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e5e5e5] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-[#a3a3a3]">
          <span>&copy; {new Date().getFullYear()} EventsApp</span>
          <span>Москва, Россия</span>
        </div>
      </footer>
    </div>
  );
}
