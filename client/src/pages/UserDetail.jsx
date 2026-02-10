// ...existing code...
import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import UserProfileCard from '../components/AdminUserManegement/UserProfileCard'
import PasswordGeneratorCard from '../components/AdminUserManegement/PasswordGeneratorCard'
import AssignQuizzesCard from '../components/AdminUserManegement/AssignQuizzesCard'
import AssignedQuizzesList from '../components/AdminUserManegement/AssignedQuizzesList'
import UserResultsCard from '../components/AdminUserManegement/UserResultsCard'

export default function UserDetail() {
  const { id } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(state?.user || null)
  const [assigned, setAssigned] = useState([])
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!user) {
      // TODO: fetch user from API: GET /api/users/:id
      // placeholder:
      setUser({ id, name: 'Loading...', email: '', role: 'participant', createdAt: '' })
    }
    // TODO: fetch assignments + results lazily
  }, [id, user])

  function handleGeneratePassword(pw) {
    // pw: returned from server — show toast/copy. placeholder returns pw
    console.log('generated pw', pw)
  }

  function handleAssignQuizzes(newAssignments) {
    // push new assignments to local state (optimistic)
    setAssigned((s) => [...newAssignments, ...s])
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <UserProfileCard user={user} onEdit={(u)=>setUser(u)} />
          <PasswordGeneratorCard userId={id} onGenerated={handleGeneratePassword} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="p-4 bg-white/5 rounded border border-white/6">
            <h2 className="text-lg font-semibold mb-3">Assign quizzes</h2>
            <AssignQuizzesCard userId={id} onAssign={handleAssignQuizzes} />
          </div>

          <AssignedQuizzesList assignments={assigned} onUnassign={(aId)=> setAssigned(s => s.filter(x => x.id !== aId))} />
          <UserResultsCard userId={id} results={results} />
        </div>
      </div>
    </div>
  )
}
// ...existing code...