import React, { useMemo, useState } from 'react'
import SearchBar from '../components/adminPage/searchBar'
import CrButton from '../components/CrButton'
import UsersTable from '../components/AdminUserManegement/UsersTable'
import NewUserModal from '../components/AdminUserManegement/NewUserModal'

export default function UsersPage() {
  const [query, setQuery] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [users, setUsers] = useState([
    { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', role: 'participant', createdAt: '2024-11-01' },
    { id: 'u2', name: 'Bob Smith', email: 'bob@example.com', role: 'participant', createdAt: '2024-11-03' },
    { id: 'u3', name: 'Carlos Admin', email: 'carlos@example.com', role: 'admin', createdAt: '2024-12-12' },
  ])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter(u => (u.name + ' ' + u.email + ' ' + u.role).toLowerCase().includes(q))
  }, [users, query])

  function handleCreate(user) {
    // user: { name, email, role, password? } — currently local only
    const newUser = { ...user, id: Date.now().toString(), createdAt: new Date().toISOString().slice(0,10) }
    setUsers(s => [newUser, ...s])
    setShowNew(false)
  }

  function handleDelete(id) {
    if (!window.confirm('Delete this user?')) return
    setUsers(s => s.filter(u => u.id !== id))
  }

  function handleUpdate(updated) {
    setUsers(s => s.map(u => u.id === updated.id ? updated : u))
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-luckiest">Users</h1>
            <p className="text-sm text-slate-400">Manage participants and admin accounts</p>
          </div>

          <div className="flex items-center gap-3">
            <CrButton color="blue" size='md' onClick={() => setShowNew(true)}>+ New User</CrButton>
            <div style={{ width: 205 }}>
              <SearchBar value={query} onChange={setQuery} />
            </div>
          </div>
        </header>

        <UsersTable users={filtered} onDelete={handleDelete} onUpdate={handleUpdate} />

        <NewUserModal open={showNew} onClose={() => setShowNew(false)} onCreate={handleCreate} />
      </div>
    </div>
  )
}