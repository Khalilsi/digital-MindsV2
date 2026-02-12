import React from "react";

export default function UserAssignmentsTabs({ activeTab, onChange }) {
  return (
    <div className="inline-flex rounded-md overflow-hidden border border-white/10">
      <button
        className={`px-4 py-2 text-sm ${activeTab === "quizzes" ? "bg-white/10" : "bg-transparent"}`}
        onClick={() => onChange("quizzes")}
      >
        Quizzes
      </button>
      <button
        className={`px-4 py-2 text-sm ${activeTab === "problems" ? "bg-white/10" : "bg-transparent"}`}
        onClick={() => onChange("problems")}
      >
        Problems
      </button>
    </div>
  );
}
