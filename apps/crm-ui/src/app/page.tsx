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
];

const DEMO_LEADS: Record<string, { name: string; event: string }[]> = {
  NEW: [
    { name: "Иван Петров", event: "Корпоратив" },
    { name: "Анна Сидорова", event: "Свадьба" },
  ],
  QUALIFICATION: [{ name: "ООО «Рога и копыта»", event: "Конференция" }],
  MEETING_SCHEDULED: [{ name: "Елена Кузнецова", event: "День рождения" }],
  ESTIMATE_AND_CONCEPT: [],
  AGREEMENT_AND_CONTRACT: [{ name: "Сергей Волков", event: "Презентация" }],
  PREPARATION: [],
  EVENT_DONE: [],
  CLOSING_DOCS_AND_NPS: [],
  WON: [{ name: "Мария Иванова", event: "Свадьба" }],
};

export default function CrmDashboard() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#171717]">
      {/* Header */}
      <header className="border-b border-[#e5e5e5] bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
          <span className="text-lg font-bold tracking-tight">
            Events<span className="text-[#6366f1]">App</span>
            <span className="ml-2 text-sm font-normal text-[#a3a3a3]">
              CRM
            </span>
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#525252]">Менеджер</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6366f1] text-xs font-bold text-white">
              М
            </div>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="mx-auto max-w-[1600px] px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">Воронка лидов</h1>

        <div className="flex gap-3 overflow-x-auto pb-4">
          {STAGES.map((stage) => (
            <div
              key={stage.key}
              className="flex w-64 min-w-[256px] flex-shrink-0 flex-col rounded-xl bg-white shadow-sm"
            >
              {/* Column header */}
              <div className="flex items-center gap-2 border-b border-[#f0f0f0] px-4 py-3">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                <span className="text-sm font-semibold">{stage.label}</span>
                <span className="ml-auto rounded-full bg-[#f5f5f5] px-2 py-0.5 text-xs font-medium text-[#737373]">
                  {(DEMO_LEADS[stage.key] ?? []).length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2 p-3">
                {(DEMO_LEADS[stage.key] ?? []).length === 0 ? (
                  <p className="py-4 text-center text-xs text-[#a3a3a3]">
                    Нет лидов
                  </p>
                ) : (
                  (DEMO_LEADS[stage.key] ?? []).map((lead, i) => (
                    <div
                      key={i}
                      className="cursor-pointer rounded-lg border border-[#e5e5e5] bg-white p-3 transition hover:shadow-md"
                    >
                      <p className="text-sm font-medium">{lead.name}</p>
                      <p className="mt-1 text-xs text-[#737373]">
                        {lead.event}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
