"use client";

import { useState, useCallback, useEffect } from "react";

const STAGES = [
  { key: "NEW", label: "Новый лид", color: "#6366f1" },
  { key: "QUALIFICATION", label: "Квалификация", color: "#8b5cf6" },
  { key: "MEETING_SCHEDULED", label: "Встреча", color: "#a855f7" },
  { key: "ESTIMATE_AND_CONCEPT", label: "Смета", color: "#d946ef" },
  { key: "AGREEMENT_AND_CONTRACT", label: "Договор", color: "#ec4899" },
  { key: "PREPARATION", label: "Подготовка", color: "#f43f5e" },
  { key: "EVENT_DONE", label: "Проведено", color: "#f97316" },
  { key: "CLOSING_DOCS_AND_NPS", label: "Закрытие", color: "#eab308" },
  { key: "WON", label: "Успех", color: "#22c55e" },
  { key: "LOST", label: "Отказ", color: "#ef4444" },
] as const;

type Stage = (typeof STAGES)[number]["key"];
type Role = "ADMIN" | "MANAGER";

interface Lead {
  id: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string | null;
  eventType: string;
  notes: string;
  stage: Stage;
}

interface TeamMember {
  id: string;
  name: string;
  role: Role;
}

const INITIAL_TEAM: TeamMember[] = [
  { id: "u1", name: "Администратор", role: "ADMIN" },
  { id: "u2", name: "Менеджер Алексей", role: "MANAGER" },
];

export default function CrmDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [currentUser, setCurrentUser] = useState<TeamMember>(INITIAL_TEAM[0]);

  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const [showTeamPanel, setShowTeamPanel] = useState(false);
  const [showAddLead, setShowAddLead] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<Role>("MANAGER");

  const isAdmin = currentUser.role === "ADMIN";

  /* ── Load leads from API ── */
  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch {
      /* API may be unavailable */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 10000);
    return () => clearInterval(interval);
  }, [fetchLeads]);

  /* ── Persist lead changes to API ── */
  async function patchLead(id: string, updates: Partial<Lead>) {
    try {
      await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch {
      /* silent */
    }
  }

  /* ── Drag & drop ── */
  const handleDragStart = useCallback((id: string) => setDraggedId(id), []);
  const handleDragOver = useCallback((e: React.DragEvent) => e.preventDefault(), []);
  const handleDrop = useCallback(
    (stage: Stage) => {
      if (!draggedId) return;
      setLeads((prev) =>
        prev.map((l) => (l.id === draggedId ? { ...l, stage } : l)),
      );
      patchLead(draggedId, { stage });
      setDraggedId(null);
    },
    [draggedId],
  );

  /* ── Lead save ── */
  function saveLead(updated: Lead) {
    setLeads((prev) =>
      prev.map((l) => (l.id === updated.id ? updated : l)),
    );
    patchLead(updated.id, updated);
    setEditingLead(null);
  }

  async function addLead(lead: Omit<Lead, "id">) {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (res.ok) {
        const created = await res.json();
        setLeads((prev) => [...prev, created]);
      }
    } catch {
      /* silent */
    }
    setShowAddLead(false);
  }

  /* ── Team management ── */
  function addMember() {
    if (!newMemberName.trim()) return;
    setTeam((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: newMemberName.trim(), role: newMemberRole },
    ]);
    setNewMemberName("");
  }

  function removeMember(id: string) {
    if (id === currentUser.id) return;
    setTeam((prev) => prev.filter((m) => m.id !== id));
  }

  function toggleRole(id: string) {
    setTeam((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, role: m.role === "ADMIN" ? "MANAGER" : "ADMIN" }
          : m,
      ),
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#171717]">
      {/* Header */}
      <header className="border-b border-[#e5e5e5] bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
          <span className="text-lg font-bold tracking-tight">
            Events<span className="text-[#6366f1]">App</span>
            <span className="ml-2 text-sm font-normal text-[#a3a3a3]">CRM</span>
          </span>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => setShowTeamPanel(!showTeamPanel)}
                className="rounded-lg border border-[#e5e5e5] px-3 py-1.5 text-xs font-medium transition hover:bg-[#f5f5f5]"
              >
                Команда
              </button>
            )}
            <button
              onClick={() => setShowAddLead(true)}
              className="rounded-lg bg-[#6366f1] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#4f46e5]"
            >
              + Новый лид
            </button>
            <select
              value={currentUser.id}
              onChange={(e) => {
                const u = team.find((m) => m.id === e.target.value);
                if (u) setCurrentUser(u);
              }}
              className="rounded-lg border border-[#e5e5e5] px-3 py-1.5 text-xs"
            >
              {team.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role === "ADMIN" ? "Админ" : "Менеджер"})
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Team panel */}
      {showTeamPanel && isAdmin && (
        <div className="border-b border-[#e5e5e5] bg-white">
          <div className="mx-auto max-w-[1600px] px-6 py-4">
            <h3 className="mb-3 text-sm font-semibold">Управление командой</h3>
            <div className="mb-3 flex flex-wrap gap-2">
              {team.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-2 rounded-lg border border-[#e5e5e5] px-3 py-2 text-xs"
                >
                  <span className="font-medium">{m.name}</span>
                  <button
                    onClick={() => toggleRole(m.id)}
                    className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                      m.role === "ADMIN"
                        ? "bg-[#6366f1] text-white"
                        : "bg-[#f0f0f0] text-[#525252]"
                    }`}
                  >
                    {m.role === "ADMIN" ? "Админ" : "Менеджер"}
                  </button>
                  {m.id !== currentUser.id && (
                    <button
                      onClick={() => removeMember(m.id)}
                      className="text-[#ef4444] hover:text-[#dc2626]"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Имя нового члена команды"
                className="rounded-lg border border-[#d4d4d4] px-3 py-1.5 text-xs outline-none focus:border-[#6366f1]"
              />
              <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value as Role)}
                className="rounded-lg border border-[#d4d4d4] px-2 py-1.5 text-xs"
              >
                <option value="MANAGER">Менеджер</option>
                <option value="ADMIN">Админ</option>
              </select>
              <button
                onClick={addMember}
                className="rounded-lg bg-[#6366f1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#4f46e5]"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="mx-auto max-w-[1600px] px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Воронка лидов</h1>
          {loading && (
            <span className="text-sm text-[#a3a3a3]">Загрузка...</span>
          )}
          {!loading && leads.length === 0 && (
            <span className="text-sm text-[#a3a3a3]">
              Нет заявок. Отправьте тестовую заявку с сайта.
            </span>
          )}
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageLeads = leads.filter((l) => l.stage === stage.key);
            return (
              <div
                key={stage.key}
                className="flex w-64 min-w-[256px] flex-shrink-0 flex-col rounded-xl bg-white shadow-sm"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage.key)}
              >
                <div className="flex items-center gap-2 border-b border-[#f0f0f0] px-4 py-3">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span className="text-sm font-semibold">{stage.label}</span>
                  <span className="ml-auto rounded-full bg-[#f5f5f5] px-2 py-0.5 text-xs font-medium text-[#737373]">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="flex min-h-[80px] flex-col gap-2 p-3">
                  {stageLeads.length === 0 ? (
                    <p className="py-4 text-center text-xs text-[#a3a3a3]">
                      Нет лидов
                    </p>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={() => handleDragStart(lead.id)}
                        onClick={() => setEditingLead(lead)}
                        className={`cursor-pointer rounded-lg border p-3 transition hover:shadow-md ${
                          draggedId === lead.id
                            ? "border-[#6366f1] bg-[#eef2ff] opacity-70"
                            : "border-[#e5e5e5] bg-white"
                        }`}
                      >
                        <p className="text-sm font-medium">{lead.contactName}</p>
                        <p className="mt-1 text-xs text-[#737373]">{lead.eventType}</p>
                        {lead.contactPhone && (
                          <p className="mt-0.5 text-xs text-[#a3a3a3]">{lead.contactPhone}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Lead Modal */}
      {editingLead && (
        <Modal onClose={() => setEditingLead(null)}>
          <h3 className="mb-4 text-lg font-semibold">Редактирование лида</h3>
          <LeadForm
            lead={editingLead}
            isAdmin={isAdmin}
            onSave={saveLead}
            onCancel={() => setEditingLead(null)}
          />
        </Modal>
      )}

      {/* Add Lead Modal */}
      {showAddLead && (
        <Modal onClose={() => setShowAddLead(false)}>
          <h3 className="mb-4 text-lg font-semibold">Новый лид</h3>
          <LeadForm
            isAdmin={isAdmin}
            onSave={(lead) => addLead(lead)}
            onCancel={() => setShowAddLead(false)}
          />
        </Modal>
      )}
    </div>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        {children}
      </div>
    </div>
  );
}

function LeadForm({
  lead,
  isAdmin,
  onSave,
  onCancel,
}: {
  lead?: Lead;
  isAdmin: boolean;
  onSave: (lead: Lead) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(lead?.contactName ?? "");
  const [phone, setPhone] = useState(lead?.contactPhone ?? "");
  const [eventType, setEventType] = useState(lead?.eventType ?? "");
  const [notes, setNotes] = useState(lead?.notes ?? "");
  const [stage, setStage] = useState<Stage>(lead?.stage ?? "NEW");

  const STAGES_LIST = [
    { key: "NEW", label: "Новый лид" },
    { key: "QUALIFICATION", label: "Квалификация" },
    { key: "MEETING_SCHEDULED", label: "Встреча" },
    { key: "ESTIMATE_AND_CONCEPT", label: "Смета" },
    { key: "AGREEMENT_AND_CONTRACT", label: "Договор" },
    { key: "PREPARATION", label: "Подготовка" },
    { key: "EVENT_DONE", label: "Проведено" },
    { key: "CLOSING_DOCS_AND_NPS", label: "Закрытие" },
    { key: "WON", label: "Успех" },
    { key: "LOST", label: "Отказ" },
  ] as const;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      id: lead?.id ?? crypto.randomUUID(),
      contactName: name,
      contactPhone: phone,
      eventType,
      notes,
      stage,
    });
  }

  const inputCls =
    "w-full rounded-lg border border-[#d4d4d4] px-3 py-2 text-sm outline-none transition focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20";
  const readonlyCls =
    "w-full rounded-lg border border-[#e5e5e5] bg-[#fafafa] px-3 py-2 text-sm text-[#737373]";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium">Имя</label>
        {isAdmin ? (
          <input value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} />
        ) : (
          <div className={readonlyCls}>{name || "—"}</div>
        )}
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium">Телефон</label>
        {isAdmin ? (
          <input value={phone} onChange={(e) => setPhone(e.target.value)} required className={inputCls} />
        ) : (
          <div className={readonlyCls}>{phone || "—"}</div>
        )}
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium">Тип мероприятия</label>
        {isAdmin ? (
          <input value={eventType} onChange={(e) => setEventType(e.target.value)} className={inputCls} />
        ) : (
          <div className={readonlyCls}>{eventType || "—"}</div>
        )}
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium">Статус</label>
        <select value={stage} onChange={(e) => setStage(e.target.value as Stage)} className={inputCls}>
          {STAGES_LIST.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium">Заметки</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={inputCls} />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-[#6366f1] py-2 text-sm font-semibold text-white transition hover:bg-[#4f46e5]"
        >
          {lead ? "Сохранить" : "Создать"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-[#d4d4d4] py-2 text-sm font-medium transition hover:bg-[#f5f5f5]"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
