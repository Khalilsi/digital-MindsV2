import React, { useState, useMemo } from 'react'
import SearchBar from '../components/adminPage/searchBar'
import QuizGrid from '../components/adminPage/QuizGrid'
import QuizList from '../components/adminPage/QuizList'
import { MdGridOn } from "react-icons/md";
import { FaList } from "react-icons/fa";
import CrButton from '../components/CrButton'
import CreateTypeModal from '../components/adminPage/CreateTypeModal'
import CreateTitleModal from '../components/adminPage/CreateTitleModal'


export default function AdminMainPage() {
  const [query, setQuery] = useState('')
  const [view, setView] = useState('grid')
  const [quizzes, setQuizzes] = useState([
    { id: 1, title: 'Arena 1 — Basics', players: 12 },
    { id: 2, title: 'Spellcraft Challenge', players: 8 },
    { id: 3, title: 'Deck Builder Showdown', players: 16 },
    { id: 4, title: 'Deck Builder ', players: 16 },
  ])
  const [showTypeModal, setShowTypeModal] = useState(false)
  const [showTitleModal, setShowTitleModal] = useState(false)
  const [selectedType, setSelectedType] = useState(null)

  const filtered = useMemo(
    () => quizzes.filter((q) => q.title.toLowerCase().includes(query.trim().toLowerCase())),
    [quizzes, query]
  )

  function handleCreate() {
    setShowTypeModal(true)
  }
  function handleTypeSelect(type) {
    setShowTypeModal(false)
    setSelectedType(type)
    setShowTitleModal(true)
  }

  function handleTitleConfirm(title) {
    const newQuiz = { id: Date.now(), title: title.trim(), players: 0, type: selectedType }
    setQuizzes((s) => [newQuiz, ...s])
    setShowTitleModal(false)
    setSelectedType(null)
    
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
          <CrButton onClick={handleCreate} color="blue" size="md">
            &#43; Create Quiz
          </CrButton>

          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-md overflow-hidden border border-white/10">
              <button
                className={`px-3 py-2 text-sm ${view === 'grid' ? 'bg-white/10' : 'bg-transparent'}`}
                onClick={() => setView('grid')}
              >
                <MdGridOn className="w-5 h-5" />
              </button>
              <button
                className={`px-3 py-2 text-sm ${view === 'list' ? 'bg-white/10' : 'bg-transparent'}`}
                onClick={() => setView('list')}
              >
                <FaList className="w-5 h-5" />
              </button>
            </div>
            <SearchBar value={query} onChange={setQuery} />
          </div>
        </header>

        <section>
          <h1 className="text-2xl mb-4 font-luckiest">Created Quizzes</h1>
          {view === 'grid' ? (
            <QuizGrid quizzes={filtered} onAssign={handleAssign} onDelete={handleDelete} />
          ) : (
            <QuizList quizzes={filtered} onAssign={handleAssign} onDelete={handleDelete} />
          )}
        </section>
      </div>
       <CreateTypeModal open={showTypeModal} onClose={() => setShowTypeModal(false)} onSelect={handleTypeSelect} />
       <CreateTitleModal open={showTitleModal} onClose={() => setShowTitleModal(false)} onConfirm={handleTitleConfirm} defaultType={selectedType} />
    </div>
  )
}