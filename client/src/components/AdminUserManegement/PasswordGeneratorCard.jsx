import React, { useState, useEffect, useRef } from "react";
import CrButton from "../CrButton";
import { MdOutlineContentCopy } from "react-icons/md";
import { authFetch } from "../../utils/auth";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

export default function PasswordGeneratorCard({ userId, onGenerated }) {
  const [loading, setLoading] = useState(false);
  const [lastPw, setLastPw] = useState(null);
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  async function generate() {
    setLoading(true);
    try {
      const pw = Math.random().toString(36).slice(2, 10);
      const response = await authFetch(
        `${API_BASE_URL}/api/admin/users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: pw }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to update password");
      }
      setLastPw(pw);
      onGenerated && onGenerated(pw);
    } finally {
      setLoading(false);
    }
  }

  function showCopied() {
    setCopied(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
  }

  async function handleCopy() {
    if (!lastPw) return;
    try {
      await navigator.clipboard.writeText(lastPw);
      showCopied();
    } catch (e) {
      console.error("Copy failed", e);
    }
  }

  return (
    <div className="p-4 bg-white/5 rounded border border-white/6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-white/80">One-time password</div>
        <CrButton size="sm" color="gold" onClick={generate} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </CrButton>
      </div>

      {lastPw ? (
        <div className="mt-2 p-3 bg-white/6 rounded text-slate-900">
          <div className="flex items-center justify-between gap-3">
            <div className="font-mono text-base text-white break-all">
              {lastPw}
            </div>
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
          <div className="text-xs text-white mt-2">
            Password shown only once. Copy it now.
          </div>
        </div>
      ) : (
        <div className="text-sm text-white">No password generated yet.</div>
      )}
    </div>
  );
}
