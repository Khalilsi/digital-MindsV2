import React from 'react'
import CrButton from '../CrButton'
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { SiGoogleanalytics } from "react-icons/si";

export default function QuizCard({ quiz, onAssign, onDelete, onEdit }) {
  return (
    <div className="relative w-56 p-6 rounded-xl border border-white-400/30 bg-gradient-to-b from-white/3 to-white/2 shadow-lg">
      <div className="min-h-[3.5rem]">
        <div>
          <h3
            className="text-lg font-semibold"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.7)', fontFamily: "'Luckiest Guy', sans-serif" }}
          >
            {quiz.title}
          </h3>      
        </div>

      </div>

      <div className="mt-4 pt-5 border-t border-white/10 flex items-center justify-center gap-2">
        <CrButton
          onClick={() => onEdit?.(quiz)}
          color='blue'
          size='sm'
          aria-label="Edit"
          title="Edit"
        >
          <FiEdit2 />
        </CrButton>
        <CrButton
          onClick={() => onEdit?.(quiz)}
          color='blue'
          size='sm'
          aria-label="Analytics"
          title="Analytics"
        >
          <SiGoogleanalytics />
        </CrButton>
        <CrButton
          onClick={() => onDelete(quiz.id)}
          color="red"
          size='sm'
          aria-label="Delete"
          title="Delete"
        >
          <FiTrash2 />
        </CrButton>
      </div>
    </div>
  )
}