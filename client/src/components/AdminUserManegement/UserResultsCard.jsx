import React from 'react'

export default function UserResultsCard({ userId, results = [] }) {
  return (
    <div className="p-4 bg-white/5 rounded border border-white/6">
      <h3 className="text-lg font-semibold mb-3">Results & activity</h3>

      {results.length === 0 ? (
        <div className="text-white/70">No results yet.</div>
      ) : (
        <ul className="space-y-2">
          {results.map((r) => (
            <li key={r.id} className="flex items-center justify-between bg-white/6 p-3 rounded">
              <div>
                <div className="text-white">{r.quizTitle}</div>
                <div className="text-xs text-white/60">{r.score}% — {r.takenAt}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}