import React from "react";
import CrButton from "../CrButton";

export default function UserProblemCard({ problem, onOpen }) {
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
      <div className="text-lg font-semibold text-white">{problem.title}</div>
      {problem.description && (
        <div className="text-sm text-white/70 mt-1 line-clamp-2">
          {problem.description}
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <CrButton color="gold" size="sm" onClick={() => onOpen(problem)}>
          Start Problem
        </CrButton>
      </div>
    </div>
  );
}
