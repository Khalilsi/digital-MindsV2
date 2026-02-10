import React, { useState, useEffect } from 'react'
import Modal from '../Modal'
import CrButton from '../CrButton'

export default function NewUserModal({ open, onClose, onCreate }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('participant')
  const [generatePassword, setGeneratePassword] = useState(true)

  useEffect(() => {
    if (open) {
      setName('')
      setEmail('')
      setRole('participant')
      setGeneratePassword(true)
    }
  }, [open])

  function handleConfirm() {
    if (!name.trim() || !email.trim()) {
      alert('Name and email are required')
      return
    }
    const payload = { name: name.trim(), email: email.trim(), role, password: generatePassword ? Math.random().toString(36).slice(2,10) : undefined }
    onCreate && onCreate(payload)
  }

  return (
    <Modal open={open} onClose={onClose} title="Create new user" footer={
      <>
        <CrButton onClick={onClose} color="red">Cancel</CrButton>
        <CrButton onClick={handleConfirm} color="gold">Create</CrButton>
      </>
    }>
      <div className="space-y-3">
        <label className="block text-sm text-white/80">Full name</label>
        <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full px-3 py-2 rounded bg-white/5 text-white focus:outline-none" />

        <label className="block text-sm text-white/80">Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full px-3 py-2 rounded bg-white/5 text-white focus:outline-none" />

        <label className="block text-sm text-white/80">Role</label>
        <select value={role} onChange={(e)=>setRole(e.target.value)} className="w-full px-3 py-2 rounded bg-white/5 text-white focus:outline-none">
          <option value="participant">Participant</option>
          <option value="admin">Admin</option>
        </select>

        
      </div>
    </Modal>
  )
}