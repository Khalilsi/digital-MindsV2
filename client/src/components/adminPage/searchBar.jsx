import React from 'react'

export default function SearchBar({ value, onChange }) {
  return (
    <input
      aria-label="Search quizzes"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search quizzes..."
      className="px-3 py-3 rounded-lg bg-white/10 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
    />
  )
}