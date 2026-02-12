import React from "react";
import CrButton from "../CrButton";

export default function UserAssignmentRow({ item, onOpenQuiz, onOpenProblem }) {
  const isQuiz = item.type === "quiz";
  const badgeClass = isQuiz
    ? "bg-blue-500/20 text-blue-200"
    : "bg-yellow-500/20 text-yellow-200";
  const buttonColor = isQuiz ? "blue" : "gold";
  const buttonLabel = isQuiz ? "Start Quiz" : "Start Problem";
  const isCompleted = item.completed;

  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className={`px-2 py-1 text-xs rounded ${badgeClass}`}>
            {isQuiz ? "Quiz" : "Problem"}
          </span>
          <div className="text-base sm:text-lg tracking-wide text-white font-luckiest truncate">
            {item.title}
          </div>
          <span className="text-xs text-white/70 bg-white/10 px-2 py-1 rounded">
            {item.points || 0} pts
          </span>
          {isCompleted && (
            <span className="text-xs text-white/70 bg-emerald-500/10 px-2 py-1 rounded">
              Completed
            </span>
          )}
        </div>
        {item.description && (
          <div className="text-sm text-white/70 mt-1 line-clamp-2">
            {item.description}
          </div>
        )}
      </div>
      <div className="shrink-0 w-full sm:w-auto">
        <CrButton
          color={buttonColor}
          size="sm"
          onClick={() => (isQuiz ? onOpenQuiz(item) : onOpenProblem(item))}
          disabled={isCompleted}
          className="w-full sm:w-auto"
        >
          {isCompleted ? "Completed" : buttonLabel}
        </CrButton>
      </div>
    </div>
  );
}
