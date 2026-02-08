import React, { useEffect, useRef, useState } from 'react'
import CrButton from '../../components/CrButton'

export default function CreateTitleModal({ open, onClose, onConfirm, defaultType }) {
  const [title, setTitle] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setTitle('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  if (!open) return null

  function handleConfirm() {
    const t = title.trim()
    if (!t) return
    onConfirm(t)
    setTitle('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg p-6 bg-gradient-to-br from-slate-900 to-indigo-900 rounded-xl border border-yellow-400/20 shadow-2xl">
        <h3 className="text-xl font-luckiest mb-3 text-white">
          New {defaultType === 'problem' ? 'Problem' : 'Classic'} — Title
        </h3>

        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter the title..."
          className="w-full mb-4 px-3 py-2 rounded-lg bg-white/5 text-white placeholder-white/60 focus:outline-none"
        />

        <div className="flex gap-3 justify-end">
          <CrButton onClick={onClose} color="red">Cancel</CrButton>
          <CrButton onClick={handleConfirm} color="gold">Create & Edit</CrButton>
        </div>
      </div>
    </div>
  )
}