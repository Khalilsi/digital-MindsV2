import React from 'react'
import CrButton from '../CrButton'


export default function QuizList({ quizzes, onAssign, onDelete }) {
  if (!quizzes.length) {
    return <div className="p-6 bg-white/5 rounded-lg text-center text-white/70">No quizzes found</div>
  }

  return (
    <div className="flex flex-col gap-4">
      {quizzes.map((q) => (
        <div key={q.id} className="bg-white/5 rounded-lg px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">{q.title}</div>

            <div className="flex items-center gap-3">
              <CrButton
                color='blue'
                size='md'
              >
                Edit
              </CrButton>
              <CrButton 
                color='blue'
                size='md'
              >
                Analyze
              </CrButton>
              <CrButton 
                color='red'
                size='md'
              >
                Delete
              </CrButton>
            </div>
          </div>

          <div className="mt-3 h-px bg-white/10" />
        </div>
      ))}
    </div>
  )
}