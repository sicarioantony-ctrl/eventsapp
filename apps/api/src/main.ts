import express from "express";
import cors from "cors";

const PORT = Number(process.env.PORT ?? 3002);
const BOT_TOKEN = process.env.BOT_TOKEN ?? "";
const NOTIFY_CHAT_ID = process.env.NOTIFY_CHAT_ID ?? "";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));

async function notifyTelegram(lead: Record<string, unknown>) {
  if (!BOT_TOKEN || !NOTIFY_CHAT_ID) return;

  const text =
    `🔔 *Новая заявка!*\n\n` +
    `👤 *Имя:* ${lead.contactName}\n` +
    `📞 *Телефон:* ${lead.contactPhone}\n` +
    `${lead.contactEmail ? `📧 *Email:* ${lead.contactEmail}\n` : ""}` +
    `🎉 *Тип:* ${lead.eventType ?? "—"}\n` +
    `${lead.notes ? `💬 *Комментарий:* ${lead.notes}\n` : ""}` +
    `\n🕐 ${lead.createdAt}`;

  try {
    await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: NOTIFY_CHAT_ID,
          text,
          parse_mode: "Markdown",
        }),
      },
    );
  } catch (err) {
    console.error("[api] Failed to send Telegram notification:", err);
  }
}

const leads: Record<string, unknown>[] = [];

app.post("/api/leads", async (req, res) => {
  const { contactName, contactPhone, contactEmail, eventType, notes } =
    req.body ?? {};

  if (!contactName || !contactPhone) {
    res.status(400).json({ error: "contactName and contactPhone are required" });
    return;
  }

  const lead = {
    id: crypto.randomUUID(),
    contactName,
    contactPhone,
    contactEmail: contactEmail || null,
    eventType: eventType || null,
    notes: notes || null,
    stage: "NEW",
    createdAt: new Date().toISOString(),
  };

  leads.push(lead);
  console.log(`[api] New lead: ${contactName} / ${contactPhone} / ${eventType}`);

  notifyTelegram(lead);

  res.status(201).json(lead);
});

app.get("/api/leads", (_req, res) => {
  res.json(leads);
});

app.listen(PORT, () => {
  console.log(`api listening on :${PORT}`);
});
