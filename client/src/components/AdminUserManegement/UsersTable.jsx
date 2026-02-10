import React from 'react'
import { FiEdit2, FiTrash2,FiEye } from 'react-icons/fi'
import CrButton from '../CrButton'
import { useNavigate } from 'react-router-dom'

export default function UsersTable({ users = [], onDelete, onUpdate }) {

  const navigate = useNavigate()

  if (!users.length) {
    return <div className="p-6 bg-white/5 rounded text-white/70">No users found.</div>
  }

  return (
    <div className="bg-white/5 rounded border border-white/6 overflow-hidden p-4">
      <table className="min-w-full divide-y divide-white/8">
        <thead className="bg-white/3 text-white/80">
          <tr>
            <th className="px-4 py-3 text-left text-sm">Name</th>
            <th className="px-4 py-3 text-left text-sm">Email</th>
            <th className="px-4 py-3 text-left text-sm">Role</th>
            <th className="px-4 py-3 text-left text-sm">Created</th>
            <th className="px-4 py-3 text-right text-sm">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/6">
          {users.map(u => (
            <tr key={u.id} className="hover:bg-white/2">
              <td className="px-4 py-3">
                <div className="font-medium text-white">{u.name}</div>
              </td>
              <td className="px-4 py-3 text-white">{u.email}</td>
              <td className="px-4 py-3 text-white">{u.role}</td>
              <td className="px-4 py-3 text-white">{u.createdAt}</td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex items-center gap-2">
                  <CrButton onClick={() => navigate(`/admin/users/${u.id}`, { state: { user: u } })} title="View User" color='blue' size='sm'>
                    <FiEye />
                  </CrButton>
                  <CrButton onClick={() => onUpdate && onUpdate({ ...u, role: u.role === 'admin' ? 'participant' : 'admin' })} title="change role" color='blue' size='sm'>
                    <FiEdit2 />
                  </CrButton>
                  <CrButton onClick={() => onDelete && onDelete(u.id)} title="Delete user" color='red' size='sm'>
                    <FiTrash2 />
                  </CrButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}