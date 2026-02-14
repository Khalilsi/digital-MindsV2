import React, { useEffect, useRef, useState } from "react";
import { List as VirtualList } from "react-window";
import Modal from "../Modal";

export default function UserResultsCard({ userId, results = [] }) {
  const list = Array.isArray(results) ? results : [];
  const containerRef = useRef(null);
  const [listWidth, setListWidth] = useState(0);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    function measure() {
      if (containerRef.current) setListWidth(containerRef.current.clientWidth);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const ITEM_HEIGHT = 68;
  const MAX_LIST_HEIGHT = 420;
  const useVirtual =
    list.length > 10 && typeof VirtualList === "function" && listWidth > 0;
  const listHeight = Math.min(MAX_LIST_HEIGHT, list.length * ITEM_HEIGHT);

  function ResultRow({ index, style, ariaAttributes, items, onSelect }) {
    const r = items[index];
    return (
      <div style={style} {...ariaAttributes}>
        <button
          type="button"
          onClick={() => onSelect(r)}
          className="w-full text-left flex items-center justify-between bg-white/6 p-3 border-b border-white/6 hover:bg-white/10 transition"
        >
          <div>
            <div className="text-white">{r.quizTitle}</div>
            <div className="text-xs text-white/60">
              {r.score} points — {r.takenAt}
            </div>
          </div>
          <div className="text-xs text-white/60">View answers</div>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="p-4 bg-white/5 rounded border border-white/6"
    >
      <h3 className="text-lg font-semibold mb-3">Results & activity</h3>

      {list.length === 0 ? (
        <div className="text-white/70">No results yet.</div>
      ) : useVirtual ? (
        <div className="rounded bg-white/6 overflow-hidden">
          <VirtualList
            rowCount={list.length}
            rowHeight={ITEM_HEIGHT}
            rowComponent={ResultRow}
            rowProps={{ items: list, onSelect: setSelected }}
            style={{ height: listHeight, width: listWidth }}
          />
        </div>
      ) : (
        <ul className="space-y-2">
          {list.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setSelected(r)}
                className="w-full text-left flex items-center justify-between bg-white/6 p-3 rounded hover:bg-white/10 transition"
              >
                <div>
                  <div className="text-white">{r.quizTitle}</div>
                  <div className="text-xs text-white/60">
                    {r.score} points — {r.takenAt}
                  </div>
                </div>
                <div className="text-xs text-white/60">View answers</div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Quiz answers"
        footer={null}
      >
        {selected && (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-white/60">Quiz</div>
              <div className="text-white font-semibold">
                {selected.quizTitle}
              </div>
            </div>
            <div>
              <div className="text-sm text-white/60">Submitted</div>
              <div className="text-white">{selected.takenAt}</div>
            </div>
            <div>
              <div className="text-sm text-white/60 mb-2">Answers</div>
              <div className="space-y-3 max-h-72 overflow-auto pr-2">
                {(selected.answers || []).map((answer, idx) => {
                  const isAnswered = Number.isInteger(answer.selectedAnswer);
                  const isCorrect =
                    isAnswered &&
                    answer.selectedAnswer === answer.correctAnswer;
                  const correctText =
                    (answer.propositions || [])[answer.correctAnswer] ||
                    "(not set)";
                  const selectedText =
                    (answer.propositions || [])[answer.selectedAnswer] ||
                    "(not answered)";
                  return (
                    <div
                      key={`${selected.id}-${idx}`}
                      className={`rounded border p-3 ${
                        isCorrect
                          ? "bg-emerald-500/10 border-emerald-500/30"
                          : "bg-rose-500/10 border-rose-500/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <div className="text-xs text-white/60">
                          Question {answer.questionIndex + 1}
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            isCorrect
                              ? "bg-emerald-500/20 text-emerald-100"
                              : "bg-rose-500/20 text-rose-100"
                          }`}
                        >
                          {isCorrect
                            ? "Correct"
                            : isAnswered
                              ? "Wrong"
                              : "Unanswered"}
                        </span>
                      </div>
                      <div className="text-white mb-2">
                        {answer.question || "(no prompt)"}
                      </div>
                      <div
                        className={`text-xs rounded px-2 py-1 mb-1 ${
                          isCorrect
                            ? "bg-emerald-500/20 text-emerald-100"
                            : "bg-rose-500/20 text-rose-100"
                        }`}
                      >
                        User answer: {selectedText}
                      </div>
                      <div className="text-xs text-emerald-100">
                        Correct answer: {correctText}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
