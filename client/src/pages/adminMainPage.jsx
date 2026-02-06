import React, { useState, useMemo } from 'react'
import SearchBar from '../components/adminPage/searchBar'
import CreateQuizButton from '../components/adminPage/CreateQuizButton'
import QuizGrid from '../components/adminPage/QuizGrid'

export default function AdminQuizzes() {
  const [query, setQuery] = useState('')
  const [quizzes, setQuizzes] = useState([
    { id: 1, title: 'Arena 1 — Basics', players: 12 },
    { id: 2, title: 'Spellcraft Challenge', players: 8 },
    { id: 3, title: 'Deck Builder Showdown', players: 16 },
  ])

  const filtered = useMemo(
    () => quizzes.filter((q) => q.title.toLowerCase().includes(query.trim().toLowerCase())),
    [quizzes, query]
  )

  function handleCreate() {
    const title = window.prompt('Create quiz — enter title')
    if (!title || !title.trim()) return
    setQuizzes((s) => [{ id: Date.now(), title: title.trim(), players: 0 }, ...s])
  }

  function handleDelete(id) {
    if (!window.confirm('Delete this quiz?')) return
    setQuizzes((s) => s.filter((q) => q.id !== id))
  }

  function handleAssign(quiz) {
    // placeholder: open assign modal / call backend
    alert(`Assign quiz: ${quiz.title}`)
  }

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 relative">
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.25),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(250,204,21,0.15),transparent_45%)]" />
      <div className="p-6 max-w-5xl mx-auto relative">
        <header className="flex items-center justify-between mb-6">
          <CreateQuizButton onClick={handleCreate} />

          <div className="flex items-center">
            <SearchBar value={query} onChange={setQuery} />
          </div>
        </header>

        <section>
          <h2 className="text-xl mb-4">Quizzes</h2>
          <QuizGrid quizzes={filtered} onAssign={handleAssign} onDelete={handleDelete} />
        </section>
      </div>
    </div>
  )
}