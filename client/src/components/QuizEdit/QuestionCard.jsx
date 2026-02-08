// ...existing code...
import React from 'react'
import CrButton from '../CrButton'
import { FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi';
 
function stripHtml(html = '') {
  return html.replace(/<[^>]+>/g, '').slice(0, 200)
}
 
export default function QuestionCard({ q, index, onEdit, onDelete }) {
  return (
    // add bottom/right padding so buttons don't overlap content
    <div className="relative p-3 pb-12 pr-12 rounded-lg bg-white/5 border border-white/6 min-h-[96px]">
      <div className="text-sm text-white/80 mb-2">#{index + 1} • {q.type}</div>
      <div className="text-white mb-3">{q.prompt ? stripHtml(q.prompt) : <span className="text-white/50">Untitled question</span>}</div>
 
      {(q.choices || []).length > 0 && (
        <ul className="text-sm text-white/90 space-y-1">
          {q.choices.map((c) => {
            const isCorrect = (q.correct || []).includes(c.id)
            return (
              <li key={c.id} className={`flex items-center gap-2 ${isCorrect ? 'text-green-300' : 'text-white/80'}`}>
                {isCorrect && <FiCheck className="w-4 h-4" />}
                <span className="truncate">{c.text || <span className="text-white/50">(empty)</span>}</span>
              </li>
            )
          })}
        </ul>
      )}
 
      {/* small icon buttons bottom-right */}
      <div className="absolute right-3 bottom-3 flex gap-2">
        <CrButton onClick={() => onEdit(q.id)} title="Edit" color="blue" size="icon" className="w-8 h-8 p-0 flex items-center justify-center">
          <FiEdit2 />
        </CrButton>
        <CrButton onClick={() => onDelete(q.id)} title="Delete" color="red" size="icon" className="w-8 h-8 p-0 flex items-center justify-center">
          <FiTrash2 />
        </CrButton>
      </div>
    </div>
  )
}
