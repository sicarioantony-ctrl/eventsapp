import express from "express";
import cors from "cors";

const PORT = Number(process.env.PORT ?? 3002);

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));

const leads: Record<string, unknown>[] = [];

app.post("/api/leads", (req, res) => {
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

  res.status(201).json(lead);
});

app.get("/api/leads", (_req, res) => {
  res.json(leads);
});

app.listen(PORT, () => {
  console.log(`api listening on :${PORT}`);
});
