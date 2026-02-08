import React from 'react'
import QuizCard from './QuizCard'

export default function QuizGrid({ quizzes, onAssign, onDelete }) {
  if (!quizzes.length) {
    return <div className="p-6 bg-white/5 rounded-lg text-center text-white/70">No quizzes found</div>
  }

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((q) => (
        <QuizCard key={q.id} quiz={q} onAssign={onAssign} onDelete={onDelete} />
      ))}
    </div>
  )
}