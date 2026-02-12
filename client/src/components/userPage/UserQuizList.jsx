import React from "react";
import UserQuizCard from "./UserQuizCard";

export default function UserQuizList({ quizzes, onOpen }) {
  if (!quizzes.length) {
    return (
      <div className="p-6 bg-white/5 rounded-lg text-center text-white/70">
        No assigned quizzes yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {quizzes.map((quiz) => (
        <UserQuizCard key={quiz.id} quiz={quiz} onOpen={onOpen} />
      ))}
    </div>
  );
}
