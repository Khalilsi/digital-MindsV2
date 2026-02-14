import React from "react";
import CrButton from "../CrButton";

export default function UserQuizCard({ quiz, onOpen }) {
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
      <div className="text-lg tracking-wide text-white font-luckiest">
        {quiz.title}
      </div>
      {quiz.description && (
        <div
          className="text-sm text-white/70 mt-1 line-clamp-2 rich-content"
          dangerouslySetInnerHTML={{ __html: quiz.description }}
        />
      )}
      <div className="mt-4 flex justify-end">
        <CrButton color="blue" size="sm" onClick={() => onOpen(quiz)}>
          Start Quiz
        </CrButton>
      </div>
    </div>
  );
}
