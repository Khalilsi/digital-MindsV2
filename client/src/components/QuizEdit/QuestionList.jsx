import React from 'react'
import QuestionCard from './QuestionCard'
import CrButton from '../CrButton'

export default function QuestionList({ questions, onAdd, onEdit, onDelete }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg text-white">Questions</h3>
        <CrButton color="blue" size="sm" onClick={onAdd}>+ Add Question</CrButton>
      </div>

      <div className="flex flex-col gap-3">
        {questions.length === 0 ? (
          <div className="p-4 bg-white/5 rounded text-white/70">No questions yet — add one</div>
        ) : (
          questions.map((q, i) => (
            <QuestionCard key={q.id} q={q} index={i} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  )
}