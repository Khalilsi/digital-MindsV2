import React from "react";
import UserProblemCard from "./UserProblemCard";

export default function UserProblemList({ problems, onOpen }) {
  if (!problems.length) {
    return (
      <div className="p-6 bg-white/5 rounded-lg text-center text-white/70">
        No assigned problems yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {problems.map((problem) => (
        <UserProblemCard key={problem.id} problem={problem} onOpen={onOpen} />
      ))}
    </div>
  );
}
