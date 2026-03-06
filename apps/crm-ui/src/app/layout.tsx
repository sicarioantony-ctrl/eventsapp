import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EventsApp CRM",
  description: "Event agency CRM dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
