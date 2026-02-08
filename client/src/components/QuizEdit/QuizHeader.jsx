import React from 'react'
import CrButton from '../CrButton'

export default function QuizHeader({ title, type, onChangeTitle, onSave, onCancel, saving }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <input
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
          className="text-2xl font-luckiest bg-transparent border-b border-white/10 text-white px-2 py-1 focus:outline-none"
        />
        <span className="ml-3 inline-block text-sm px-2 py-1 rounded-md bg-white/10 text-white/80">{type}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-white/60">{saving ? 'Saving...' : 'All changes saved'}</span>
        <CrButton color="red" onClick={onCancel}>Cancel</CrButton>
        <CrButton color="gold" onClick={onSave}>Save</CrButton>
      </div>
    </div>
  )
}