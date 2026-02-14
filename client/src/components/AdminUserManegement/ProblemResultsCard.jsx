import React, { useEffect, useRef, useState } from "react";
import { List as VirtualList } from "react-window";
import Modal from "../Modal";

export default function ProblemResultsCard({ results = [] }) {
  const list = Array.isArray(results) ? results : [];
  const containerRef = useRef(null);
  const [listWidth, setListWidth] = useState(0);
  const [selected, setSelected] = useState(null);
  const answerRef = useRef(null);
  const [answerWidth, setAnswerWidth] = useState(0);

  function SubmissionRow({ index, style, ariaAttributes, items, onSelect }) {
    const r = items[index];
    return (
      <button
        type="button"
        onClick={() => onSelect(r)}
        style={style}
        {...ariaAttributes}
        className="w-full text-left flex items-center justify-between bg-white/6 p-3 border-b border-white/6 hover:bg-white/10 transition"
      >
        <div>
          <div className="text-white">{r.problemTitle}</div>
          <div className="text-xs text-white/60">
            Submitted: {r.submittedAt}
          </div>
        </div>
        <div className="text-xs text-white/60">View answer</div>
      </button>
    );
  }

  function AnswerRow({ index, style, ariaAttributes, lines }) {
    return (
      <div
        style={style}
        {...ariaAttributes}
        className="px-2 text-sm whitespace-pre-wrap"
      >
        {lines[index] || " "}
      </div>
    );
  }

  useEffect(() => {
    function measure() {
      if (containerRef.current) setListWidth(containerRef.current.clientWidth);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    function measureAnswer() {
      if (answerRef.current) setAnswerWidth(answerRef.current.clientWidth);
    }
    measureAnswer();
    window.addEventListener("resize", measureAnswer);
    return () => window.removeEventListener("resize", measureAnswer);
  }, [selected]);

  const ITEM_HEIGHT = 72;
  const MAX_LIST_HEIGHT = 420;
  const useVirtual =
    list.length > 10 && typeof VirtualList === "function" && listWidth > 0;
  const listHeight = Math.min(MAX_LIST_HEIGHT, list.length * ITEM_HEIGHT);

  return (
    <div
      ref={containerRef}
      className="p-4 bg-white/5 rounded border border-white/6"
    >
      <h3 className="text-lg font-semibold mb-3">Problem submissions</h3>

      {list.length === 0 ? (
        <div className="text-white/70">No submissions yet.</div>
      ) : useVirtual ? (
        <div className="rounded bg-white/6 overflow-hidden">
          <VirtualList
            rowCount={list.length}
            rowHeight={ITEM_HEIGHT}
            rowComponent={SubmissionRow}
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
                  <div className="text-white">{r.problemTitle}</div>
                  <div className="text-xs text-white/60">
                    Submitted: {r.submittedAt}
                  </div>
                </div>
                <div className="text-xs text-white/60">View answer</div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Submitted answer"
        footer={null}
      >
        {selected && (
          <div className="space-y-3">
            <div>
              <div className="text-sm text-white/60">Problem</div>
              <div className="text-white font-semibold">
                {selected.problemTitle}
              </div>
              {selected.problemDescription && (
                <div
                  className="text-sm text-white/70 mt-2 whitespace-pre-wrap rich-content"
                  dangerouslySetInnerHTML={{
                    __html: selected.problemDescription,
                  }}
                />
              )}
            </div>
            <div>
              <div className="text-sm text-white/60">Submitted</div>
              <div className="text-white">{selected.submittedAt}</div>
            </div>
            <div>
              <div className="text-sm text-white/60">Answer</div>
              {(() => {
                const answerText = selected.userAnswer || "(no answer)";
                const lines = answerText.split(/\r?\n/);
                const LINE_HEIGHT = 22;
                const MAX_HEIGHT = 240;
                const height = Math.max(
                  44,
                  Math.min(MAX_HEIGHT, lines.length * LINE_HEIGHT),
                );
                const width = Math.max(1, answerWidth || 0);

                return (
                  <div
                    ref={answerRef}
                    className="bg-white/5 rounded p-2 text-white"
                  >
                    {width > 1 ? (
                      <VirtualList
                        rowCount={lines.length}
                        rowHeight={LINE_HEIGHT}
                        rowComponent={AnswerRow}
                        rowProps={{ lines }}
                        style={{ height, width }}
                      />
                    ) : (
                      <div className="px-2 text-sm whitespace-pre-wrap">
                        {answerText}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
            <div className="text-xs text-white/60">
              Points are set manually outside the website.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
