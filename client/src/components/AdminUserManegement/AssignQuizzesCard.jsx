import React, { useMemo, useState } from "react";
import CrButton from "../../components/CrButton";
import { List as VirtualList } from "react-window";

export default function AssignQuizzesCard({
  availableQuizzes = [],
  assignedQuizIds = [],
  loadingList = false,
  onAssign,
}) {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  function toggle(id) {
    if (assignedQuizIds.includes(id)) return;
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  }

  async function handleAssign() {
    if (!selected.length) return;
    setLoading(true);
    try {
      onAssign && onAssign(selected);
      setSelected([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return availableQuizzes.filter((q) =>
      q.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [availableQuizzes, search]);

  const ITEM_HEIGHT = 48;
  const MAX_LIST_HEIGHT = 400;
  const useVirtual = filtered.length > 25;

  function QuizRow({ index, style, ariaAttributes, items, assignedIds, selectedIds, onToggle }) {
    const q = items[index];
    const isAssigned = assignedIds.includes(q.id);
    return (
      <div style={style} {...ariaAttributes} className="flex items-center gap-3 px-3">
        <label
          className={`flex items-center gap-3 w-full p-2 ${
            isAssigned ? "opacity-50" : ""
          }`}
        >
          <input
            type="checkbox"
            checked={selectedIds.includes(q.id)}
            onChange={() => onToggle(q.id)}
            disabled={isAssigned}
            aria-label={`Select quiz ${q.title}`}
            className="shrink-0"
          />
          <div className="text-white truncate">{q.title}</div>
          {isAssigned && (
            <div className="text-xs text-white/60">Assigned</div>
          )}
        </label>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search quizzes..."
          className="flex-1 px-3 py-2 rounded bg-white/5 text-white focus:outline-none"
        />
        <CrButton
          color="blue"
          onClick={handleAssign}
          disabled={loading || selected.length === 0}
        >
          {loading ? "Assigning..." : `Assign (${selected.length})`}
        </CrButton>
      </div>

      <div className="grid gap-2">
        {loadingList ? (
          <div className="text-white/60">Loading quizzes…</div>
        ) : filtered.length === 0 ? (
          <div className="text-white/60">No quizzes found.</div>
        ) : useVirtual ? (
          <div className="rounded bg-white/6 overflow-hidden">
            <VirtualList
              rowCount={filtered.length}
              rowHeight={ITEM_HEIGHT}
              rowComponent={QuizRow}
              rowProps={{
                items: filtered,
                assignedIds: assignedQuizIds,
                selectedIds: selected,
                onToggle: toggle,
              }}
              style={{
                height: Math.min(MAX_LIST_HEIGHT, filtered.length * ITEM_HEIGHT),
                width: "100%",
              }}
            />
          </div>
        ) : (
          <div className="grid gap-2 max-h-64 overflow-auto pr-2">
            {filtered.map((q) => {
              const isAssigned = assignedQuizIds.includes(q.id);
              return (
                <label
                  key={q.id}
                  className={`flex items-center gap-3 p-2 rounded bg-white/6 ${
                    isAssigned ? "opacity-50" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(q.id)}
                    onChange={() => toggle(q.id)}
                    disabled={isAssigned}
                  />
                  <div className="text-white truncate">{q.title}</div>
                  {isAssigned && (
                    <div className="text-xs text-white/60">Assigned</div>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
