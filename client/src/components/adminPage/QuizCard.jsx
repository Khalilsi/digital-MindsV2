import React from 'react'
import CrButton from '../CrButton'

export default function QuizCard({ quiz, onAssign, onDelete }) {
  return (
    <div className="relative p-4 rounded-xl border border-yellow-400/30 bg-gradient-to-b from-white/3 to-white/2 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <h3
            className="text-lg font-semibold"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.7)', fontFamily: "'Luckiest Guy', sans-serif" }}
          >
            {quiz.title}
          </h3>
          <p className="text-sm text-white/80">Players: {quiz.players}</p>
        </div>

        <div className="flex flex-col gap-2 ml-4">
          <CrButton onClick={() => onAssign(quiz)} className="bg-blue-600 text-white px-3 py-1 text-sm">
            Assign
          </CrButton>
          <button
            onClick={() => onDelete(quiz.id)}
            className="text-sm px-3 py-1 rounded-md bg-red-600/90 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}