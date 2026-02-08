import React from 'react'

export default function PreviewPanel({ question }) {
  if (!question) return <div className="p-4 bg-white/5 rounded text-white/70">Select a question to preview</div>

  return (
    <div className="p-4 rounded-lg bg-white/6 border border-white/8">
      <div className="text-sm text-white/80 mb-2">Preview</div>
      <div className="text-white mb-3">{question.prompt}</div>

      {(question.choices || []).length > 0 && (
        <ul className="list-disc list-inside space-y-2">
          {question.choices.map((c) => (
            <li key={c.id} className="text-white/90">{c.text}</li>
          ))}
        </ul>
      )}
    </div>
  )
}