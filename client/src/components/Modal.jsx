import React, { useEffect } from 'react'

export default function Modal({ open, onClose, title, children, footer, size = 'md', className = '' }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-3xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${sizes[size]} mx-4 p-6 bg-gradient-to-br from-slate-900 to-indigo-900 rounded-xl border border-yellow-400/20 shadow-2xl ${className}`}
      >
        {title && <h3 className="text-xl font-luckiest mb-3 text-white">{title}</h3>}
        <div className="mb-4">{children}</div>
        {footer && <div className="flex gap-3 justify-end">{footer}</div>}
      </div>
    </div>
  )
}