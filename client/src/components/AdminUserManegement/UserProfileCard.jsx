// ...existing code...
import React from 'react'
import CrButton from '../CrButton'

export default function UserProfileCard({ user, onEdit }) {
  if (!user) return <div className="p-4 bg-white/6 rounded">Loading...</div>

  return (
    <div className="p-4 bg-white/5 rounded border border-white/6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold text-white">{user.name}</div>
          <div className="text-sm text-white/80">{user.email}</div>
          <div className="text-xs text-white/60 mt-2">Role: {user.role} • Created: {user.createdAt}</div>
        </div>
        <CrButton size="sm" color="blue" onClick={() => onEdit && onEdit(user)}>Edit</CrButton>
      </div>
    </div>
  )
}
// ...existing code...