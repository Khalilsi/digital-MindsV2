import React, { useEffect, useState } from 'react'
import CrButton from '../../components/CrButton'
import { List as VirtualList } from 'react-window'

export default function AssignQuizzesCard({ userId, onAssign }) {
  const [available, setAvailable] = useState([])
  const [selected, setSelected] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingList, setLoadingList] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoadingList(true)
      try {
        // TODO: GET /api/quizzes?limit=20 or GET /api/quizzes?search=
        await new Promise((r) => setTimeout(r, 400))
        const mock = [
          { id: 'q1', title: 'Math basics' },
          { id: 'q2', title: 'Algo challenge' },
          { id: 'q3', title: 'React quiz' },
          { id: 'q4', title: 'History facts' },
          { id: 'q5', title: 'Science trivia' },
          { id: 'q6', title: 'Literature test' },
          { id: 'q7', title: 'Geography quiz' },
          { id: 'q8', title: 'Sports knowledge' },
          { id: 'q9', title: 'Music theory' },
                

        ]
        if (mounted) setAvailable(mock)
      } finally {
        if (mounted) setLoadingList(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  function toggle(id) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  async function handleAssign() {
    if (!selected.length) return
    setLoading(true)
    try {
      // TODO: POST /api/users/:id/assign { quizIds: selected } -> returns assignments
      await new Promise((r) => setTimeout(r, 600))
      const newAssignments = selected.map((qid) => ({
        id: Date.now().toString() + '-' + qid,
        quizId: qid,
        title: available.find((a) => a.id === qid)?.title || qid,
      }))
      onAssign && onAssign(newAssignments)
      setSelected([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = available.filter((q) => q.title.toLowerCase().includes(search.toLowerCase()))

  const ITEM_HEIGHT = 48
  const MAX_LIST_HEIGHT = 400
  const useVirtual = filtered.length > 25

return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search quizzes..."
          className="flex-1 px-3 py-2 rounded bg-white/5 text-white focus:outline-none"
        />
        <CrButton color="blue" onClick={handleAssign} disabled={loading || selected.length === 0}>
          {loading ? 'Assigning...' : `Assign (${selected.length})`}
        </CrButton>
      </div>

      <div className="grid gap-2">
        {loadingList ? (
          <div className="text-white/60">Loading quizzes…</div>
        ) : filtered.length === 0 ? (
          <div className="text-white/60">No quizzes found.</div>
        ) : useVirtual ? (
          <div className="rounded bg-white/6 overflow-hidden">
            <VirtualList
              height={Math.min(MAX_LIST_HEIGHT, filtered.length * ITEM_HEIGHT)}
              itemCount={filtered.length}
              itemSize={ITEM_HEIGHT}
              width="100%"
            >
              {({ index, style }) => {
                const q = filtered[index]
                return (
                  <div style={style} className="flex items-center gap-3 px-3" key={q.id}>
                    <label className="flex items-center gap-3 w-full p-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(q.id)}
                        onChange={() => toggle(q.id)}
                        aria-label={`Select quiz ${q.title}`}
                        className="shrink-0"
                      />
                      <div className="text-white truncate">{q.title}</div>
                    </label>
                  </div>
                )
              }}
            </VirtualList>
          </div>
        ) : (
          <div className="grid gap-2 max-h-64 overflow-auto pr-2">
            {filtered.map((q) => (
              <label key={q.id} className="flex items-center gap-3 p-2 rounded bg-white/6">
                <input type="checkbox" checked={selected.includes(q.id)} onChange={() => toggle(q.id)} />
                <div className="text-white truncate">{q.title}</div>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}