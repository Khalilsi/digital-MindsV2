// ...existing code...
import React, { useEffect, useState } from "react";
import CrButton from "../CrButton";
import RichTextEditor from "./RichTextEditor .jsx";

// Use shared utility – stripHtml for empty-check only
import { stripHtml } from "../../utils/sanitizeHtml";

export default function QuestionEditor({ question, onSave, onClose }) {
  // work on a local draft so changes are committed only when saved
  const [local, setLocal] = useState(
    question ? JSON.parse(JSON.stringify(question)) : null,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    setLocal(question ? JSON.parse(JSON.stringify(question)) : null);
    setError("");
  }, [question]);

  if (!local) return null;

  function update(up) {
    setError("");
    setLocal((l) => ({ ...l, ...up }));
  }

  function updateChoice(idx, text) {
    setError("");
    const choices = [...(local.choices || [])];
    choices[idx] = { ...choices[idx], text };
    update({ choices });
  }

  function addChoice() {
    setError("");
    const newId = Date.now().toString();
    const choices = [...(local.choices || []), { id: newId, text: "" }];
    update({ choices });
  }

  function deleteChoice(idx) {
    setError("");
    const choices = [...(local.choices || [])];
    const [removed] = choices.splice(idx, 1);
    update({ choices });
    if (removed && (local.correct || []).includes(removed.id)) {
      update({
        correct: (local.correct || []).filter((c) => c !== removed.id),
      });
    }
  }

  function toggleCorrect(choiceId, checked) {
    setError("");
    const correct = new Set(local.correct || []);
    if (checked) correct.add(choiceId);
    else correct.delete(choiceId);
    update({ correct: Array.from(correct) });
  }

  function handleSave() {
    const promptText = stripHtml(local.prompt || "").trim();
    if (!promptText) {
      setError("Question prompt is required.");
      return;
    }
    // basic validation
    if (local.type === "single" || local.type === "multiple") {
      if ((local.choices || []).length < 2) {
        setError("Please add at least 2 choices.");
        return;
      }
      const hasEmptyChoice = (local.choices || []).some(
        (choice) => !choice.text || !choice.text.trim(),
      );
      if (hasEmptyChoice) {
        setError("All choices must have a value.");
        return;
      }
      if (!local.correct || local.correct.length === 0) {
        setError("Select at least one correct answer.");
        return;
      }
    }
    onSave && onSave(local);
  }

  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/6">
      <div className="flex justify-between items-start mb-3">
        <div className="text-white font-semibold">Edit question</div>
        <div className="text-sm text-white/70">type: {local.type}</div>
      </div>

      {error && (
        <div className="mb-3 rounded bg-red-500/10 border border-red-500/30 p-2 text-xs text-red-200">
          {error}
        </div>
      )}

      <label className="block text-sm text-white/80 mb-1">Prompt</label>
      <div className="mb-3">
        <RichTextEditor
          value={local.prompt || ""}
          onChange={(val) => update({ prompt: val })}
          placeholder="Write the question prompt here..."
        />
      </div>

      {(local.type === "single" || local.type === "multiple") && (
        <>
          <div className="mb-3">
            <label className="block text-sm text-white/80 mb-1">Points</label>
            <input
              type="number"
              min="1"
              value={local.points || 1}
              onChange={(e) => update({ points: Number(e.target.value) || 1 })}
              className="w-32 px-2 py-1 rounded bg-white/6 text-slate-950 focus:outline-none"
            />
          </div>
          <div className="mb-2 text-sm text-white/80">Choices</div>
          <div className="flex flex-col gap-2 mb-3">
            {(local.choices || []).map((c, i) => (
              <div key={c.id} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={(local.correct || []).includes(c.id)}
                  onChange={(e) => toggleCorrect(c.id, e.target.checked)}
                  className="w-4 h-4 rounded bg-white/10 border-white/20"
                  aria-label={`Mark choice ${i + 1} as correct`}
                />
                <input
                  className="flex-1 px-2 py-1 rounded bg-white/6 text-slate-950 focus:outline-none "
                  value={c.text}
                  onChange={(e) => updateChoice(i, e.target.value)}
                  placeholder="Write the choice here..."
                />
                <button
                  onClick={() => deleteChoice(i)}
                  className="ml-2 text-sm w-7 h-7 flex items-center justify-center rounded bg-red-600/80 hover:bg-red-600"
                  title="Delete choice"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <CrButton size="sm" color="gold" onClick={addChoice}>
            Add choice
          </CrButton>
        </>
      )}

      <div className="mt-4 flex justify-end gap-3">
        <CrButton color="red" onClick={onClose}>
          Cancel
        </CrButton>
        <CrButton color="blue" onClick={handleSave}>
          Save Question
        </CrButton>
      </div>
    </div>
  );
}
// ...existing code...
