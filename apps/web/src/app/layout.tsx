import type { Metadata } from "next";
import { CookieBanner } from "@/components/cookie-banner";
import { YandexMetrika } from "@/components/yandex-metrika";
import "./globals.css";

export const metadata: Metadata = {
  title: "EventsApp — Организация мероприятий",
  description:
    "Организация корпоративов, свадеб, мастер-классов и вечеринок. ИП Саутина О.С.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">
        {children}
        <CookieBanner />
        <YandexMetrika />
      </body>
    </html>
  );
}
