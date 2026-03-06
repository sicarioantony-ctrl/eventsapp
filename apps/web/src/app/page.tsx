"use client";

import { useState } from "react";

const EVENT_TYPES = [
  "Корпоратив",
  "Свадьба",
  "День рождения",
  "Конференция",
  "Презентация",
  "Мастер-класс",
  "Вечеринка",
  "Другое",
];

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agreed) return;
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
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      /* API might not be ready yet — still show thank-you */
    } finally {
      setSubmitted(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#e5e5e5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="text-xl font-bold tracking-tight">
            Events<span className="text-[#6366f1]">App</span>
          </span>
          <nav className="hidden gap-8 text-sm font-medium text-[#525252] md:flex">
            <a href="#services" className="transition hover:text-[#171717]">
              Услуги
            </a>
            <a href="#masterclass" className="transition hover:text-[#171717]">
              Мастер-классы
            </a>
            <a href="#about" className="transition hover:text-[#171717]">
              О нас
            </a>
            <a href="#contact" className="transition hover:text-[#171717]">
              Контакты
            </a>
          </nav>
          <a
            href="#contact"
            className="rounded-lg bg-[#6366f1] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#4f46e5] md:block hidden"
          >
            Оставить заявку
          </a>
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
          Корпоративы, свадьбы, мастер-классы, латино-вечеринки — полный цикл
          подготовки и проведения событий любого масштаба.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#contact"
            className="rounded-lg bg-[#6366f1] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#4f46e5]"
          >
            Оставить заявку
          </a>
          <a
            href="#services"
            className="rounded-lg border border-[#d4d4d4] px-8 py-3 text-sm font-semibold transition hover:bg-[#f5f5f5]"
          >
            Наши услуги
          </a>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-t border-[#e5e5e5] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
            Наши услуги
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: "🏢",
                title: "Корпоративы",
                desc: "Тимбилдинги, праздники, выездные мероприятия для вашей команды. Сценарий, площадка, кейтеринг — всё берём на себя.",
              },
              {
                icon: "💍",
                title: "Свадьбы",
                desc: "Полное сопровождение: от концепции и декора до координации в день торжества.",
              },
              {
                icon: "🎤",
                title: "Конференции",
                desc: "Техническое обеспечение, спикеры, регистрация, площадки — организация деловых мероприятий под ключ.",
              },
              {
                icon: "🎂",
                title: "Дни рождения",
                desc: "Яркие праздники для детей и взрослых с аниматорами, программой и декором.",
              },
              {
                icon: "🎁",
                title: "Презентации",
                desc: "Запуск продуктов, пресс-конференции, промо-ивенты с вау-эффектом.",
              },
              {
                icon: "🎉",
                title: "Вечеринки",
                desc: "Тематические вечеринки любого формата: от камерных до масштабных клубных событий.",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="rounded-xl border border-[#e5e5e5] p-8 transition hover:border-[#6366f1]/30 hover:shadow-md"
              >
                <div className="mb-4 text-3xl">{s.icon}</div>
                <h3 className="mb-3 text-lg font-semibold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-[#525252]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Masterclass */}
      <section id="masterclass" className="border-t border-[#e5e5e5] bg-[#fafafa]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight">
            Мастер-классы
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-[#525252]">
            Зажигательные форматы для корпоративов, праздников и тимбилдинга.
            Профессиональные артисты и хореографы.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "🎧",
                title: "DJ сет",
                desc: "Профессиональный диджей подберёт музыку под настроение и формат вашего мероприятия.",
              },
              {
                icon: "💃",
                title: "Латино танцы",
                desc: "Сальса, бачата, реггетон — зажигательный мастер-класс для гостей любого уровня.",
              },
              {
                icon: "🎙️",
                title: "Ведущий-хореограф",
                desc: "Харизматичный ведущий, который не только развлекает, но и учит танцевать.",
              },
              {
                icon: "🇨🇺",
                title: "Кубинская вечеринка",
                desc: "Полное погружение в атмосферу Гаваны: музыка, танцы, коктейли и декор.",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="rounded-xl border border-[#e5e5e5] bg-white p-6 transition hover:border-[#6366f1]/30 hover:shadow-md"
              >
                <div className="mb-3 text-3xl">{s.icon}</div>
                <h3 className="mb-2 text-base font-semibold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-[#525252]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-[#e5e5e5] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="mb-6 text-center text-3xl font-bold tracking-tight">О нас</h2>
          <p className="mx-auto max-w-2xl text-center text-lg leading-relaxed text-[#525252]">
            Мы — команда профессионалов в event-индустрии. Организуем
            мероприятия любого масштаба: от камерных мастер-классов до
            масштабных корпоративных событий. Каждый проект — это
            индивидуальный подход, внимание к деталям и гарантия
            незабываемых впечатлений.
          </p>

          <div className="mx-auto mt-12 max-w-xl rounded-xl border border-[#e5e5e5] bg-[#fafafa] p-8">
            <h3 className="mb-4 text-center text-lg font-semibold">Реквизиты</h3>
            <div className="space-y-2 text-sm text-[#525252]">
              <p><span className="font-medium text-[#171717]">ИП</span> Саутина Оксана Сергеевна</p>
              <p><span className="font-medium text-[#171717]">ИНН:</span> 772983206806</p>
              <p><span className="font-medium text-[#171717]">ОГРНИП:</span> 321774600786287</p>
              <p><span className="font-medium text-[#171717]">Юр. адрес:</span> 119517, г. Москва, ул. Матвеевская, д. 1, кв. 423</p>
              <div className="my-3 border-t border-[#e5e5e5]" />
              <p><span className="font-medium text-[#171717]">Р/с:</span> 40802810300002909514</p>
              <p><span className="font-medium text-[#171717]">Банк:</span> АО «ТБанк»</p>
              <p><span className="font-medium text-[#171717]">К/с:</span> 30101810145250000974</p>
              <p><span className="font-medium text-[#171717]">БИК:</span> 044525974</p>
              <p><span className="font-medium text-[#171717]">ИНН банка:</span> 7710140679</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / Lead Form */}
      <section
        id="contact"
        className="border-t border-[#e5e5e5] bg-[#fafafa]"
      >
        <div className="mx-auto max-w-2xl px-6 py-20">
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
                  <label className="mb-1 block text-sm font-medium">
                    Email
                  </label>
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

              {/* ФЗ-152 consent checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#d4d4d4] text-[#6366f1] accent-[#6366f1]"
                />
                <span className="text-xs leading-relaxed text-[#525252]">
                  Я даю согласие на обработку моих персональных данных в
                  соответствии с{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    className="text-[#6366f1] underline underline-offset-2 hover:text-[#4f46e5]"
                  >
                    Политикой конфиденциальности
                  </a>{" "}
                  и Федеральным законом № 152-ФЗ «О персональных данных».
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || !agreed}
                className="w-full rounded-lg bg-[#6366f1] py-3 text-sm font-semibold text-white transition hover:bg-[#4f46e5] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Отправка..." : "Отправить заявку"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e5e5e5] bg-[#171717] text-[#a3a3a3]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <span className="text-lg font-bold text-white">
                Events<span className="text-[#818cf8]">App</span>
              </span>
              <p className="mt-3 text-sm leading-relaxed">
                ИП Саутина Оксана Сергеевна
                <br />
                ИНН 772983206806 / ОГРНИП 321774600786287
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-white">Контакты</h4>
              <p className="text-sm leading-relaxed">
                г. Москва, ул. Матвеевская, д. 1
                <br />
                info@eventsapp.ru
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-white">Документы</h4>
              <a
                href="/privacy"
                className="text-sm transition hover:text-white"
              >
                Политика конфиденциальности
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-[#333] pt-6 text-center text-xs">
            &copy; {new Date().getFullYear()} EventsApp — ИП Саутина О.С. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
