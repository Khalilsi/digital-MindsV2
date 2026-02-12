import React from "react";
import CrButton from "../CrButton";

export default function QuizList({
  quizzes,
  onDelete,
  onEdit,
  onAnalyze,
  showAnalyze = true,
}) {
  if (!quizzes.length) {
    return (
      <div className="p-6 bg-white/5 rounded-lg text-center text-white/70">
        No items found
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {quizzes.map((q) => (
        <div key={q.id} className="bg-white/5 rounded-lg px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">{q.title}</div>

            <div className="flex items-center gap-3">
              <CrButton
                color="blue"
                size="md"
                onClick={() => onEdit && onEdit(q)}
              >
                Edit
              </CrButton>
              {/* {showAnalyze && (
                <CrButton
                  color="blue"
                  size="md"
                  onClick={() => onAnalyze && onAnalyze(q)}
                >
                  Analyze
                </CrButton>
              )} */}
              <CrButton
                color="red"
                size="md"
                onClick={() => onDelete && onDelete(q.id)}
              >
                Delete
              </CrButton>
            </div>
          </div>

          <div className="mt-3 h-px bg-white/10" />
        </div>
      ))}
    </div>
  );
}
