import React, { useState, useEffect, useRef } from 'react'
import CrButton from '../CrButton'
import { MdOutlineContentCopy } from "react-icons/md";

export default function PasswordGeneratorCard({ userId, onGenerated }) {
  const [loading, setLoading] = useState(false)
  const [lastPw, setLastPw] = useState(null)
  const [copied, setCopied] = useState(false)
  const copyTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    }
  }, [])

  async function generate() {
    setLoading(true)
    try {
      // TODO: call API POST /api/users/:id/password
      // placeholder: simulate server pw generation
      await new Promise((r) => setTimeout(r, 700))
      const pw = Math.random().toString(36).slice(2, 10)
      setLastPw(pw)
      onGenerated && onGenerated(pw)
    } finally {
      setLoading(false)
    }
  }

  function showCopied() {
    setCopied(true)
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    copyTimerRef.current = setTimeout(() => setCopied(false), 2000)
  }

  async function handleCopy() {
    if (!lastPw) return
    try {
      await navigator.clipboard.writeText(lastPw)
      showCopied()
    } catch (e) {
      console.error('Copy failed', e)
    }
  }

  return (
    <div className="p-4 bg-white/5 rounded border border-white/6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-white/80">One-time password</div>
        <CrButton size="sm" color="gold" onClick={generate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate'}
        </CrButton>
      </div>

      {lastPw ? (
        <div className="mt-2 p-3 bg-white/6 rounded text-slate-900">
          <div className="flex items-center justify-between gap-3">
            <div className="font-mono text-base text-white break-all">{lastPw}</div>
            <div className="flex items-center gap-3">
              <CrButton size="icon" onClick={handleCopy} title="Copy password">
                <MdOutlineContentCopy />
              </CrButton>

              {/* transient copied indicator */}
              {copied && (
                <span
                  role="status"
                  aria-live="polite"
                  className="text-xs bg-green-600 text-white px-2 py-0.5 rounded"
                >
                  Copied!
                </span>
              )}
            </div>
          </div>
          <div className="text-xs text-white mt-2">Password shown only once. Copy it now.</div>
        </div>
      ) : (
        <div className="text-sm text-white">No password generated yet.</div>
      )}
    </div>
  )
}