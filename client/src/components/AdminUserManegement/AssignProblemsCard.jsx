import React, { useMemo, useState } from "react";
import CrButton from "../../components/CrButton";
import { List as VirtualList } from "react-window";

export default function AssignProblemsCard({
  availableProblems = [],
  assignedProblemIds = [],
  loadingList = false,
  onAssign,
}) {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  function toggle(id) {
    if (assignedProblemIds.includes(id)) return;
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
    return availableProblems.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [availableProblems, search]);

  const ITEM_HEIGHT = 48;
  const MAX_LIST_HEIGHT = 400;
  const useVirtual = filtered.length > 25;

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search problems..."
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
          <div className="text-white/60">Loading problems…</div>
        ) : filtered.length === 0 ? (
          <div className="text-white/60">No problems found.</div>
        ) : useVirtual ? (
          <div className="rounded bg-white/6 overflow-hidden">
            <VirtualList
              height={Math.min(MAX_LIST_HEIGHT, filtered.length * ITEM_HEIGHT)}
              itemCount={filtered.length}
              itemSize={ITEM_HEIGHT}
              width="100%"
            >
              {({ index, style }) => {
                const p = filtered[index];
                const isAssigned = assignedProblemIds.includes(p.id);
                return (
                  <div
                    style={style}
                    className="flex items-center gap-3 px-3"
                    key={p.id}
                  >
                    <label
                      className={`flex items-center gap-3 w-full p-2 ${isAssigned ? "opacity-50" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(p.id)}
                        onChange={() => toggle(p.id)}
                        disabled={isAssigned}
                        aria-label={`Select problem ${p.title}`}
                        className="shrink-0"
                      />
                      <div className="text-white truncate">{p.title}</div>
                      {isAssigned && (
                        <div className="text-xs text-white/60">Assigned</div>
                      )}
                    </label>
                  </div>
                );
              }}
            </VirtualList>
          </div>
        ) : (
          <div className="grid gap-2 max-h-64 overflow-auto pr-2">
            {filtered.map((p) => {
              const isAssigned = assignedProblemIds.includes(p.id);
              return (
                <label
                  key={p.id}
                  className={`flex items-center gap-3 p-2 rounded bg-white/6 ${
                    isAssigned ? "opacity-50" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(p.id)}
                    onChange={() => toggle(p.id)}
                    disabled={isAssigned}
                  />
                  <div className="text-white truncate">{p.title}</div>
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
