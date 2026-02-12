import React from "react";
import UserAssignmentRow from "./UserAssignmentRow";

export default function UserAssignmentList({
  assignments,
  onOpenQuiz,
  onOpenProblem,
}) {
  if (!assignments.length) {
    return (
      <div className="p-6 bg-white/5 rounded-lg text-center text-white/70">
        No assigned quizzes or problems yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {assignments.map((item) => (
        <UserAssignmentRow
          key={`${item.type}-${item.id}`}
          item={item}
          onOpenQuiz={onOpenQuiz}
          onOpenProblem={onOpenProblem}
        />
      ))}
    </div>
  );
}
