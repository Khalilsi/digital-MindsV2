// ...existing code...
import React from "react";
import CrButton from "../CrButton";

export default function UserProfileCard({ user, onToggleStatus }) {
  if (!user) return <div className="p-4 bg-white/6 rounded">Loading...</div>;

  const statusLabel = user.isActive ? "Active" : "Inactive";
  const toggleLabel = user.isActive ? "Deactivate" : "Activate";

  return (
    <div className="p-4 bg-white/5 rounded border border-white/6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold text-white">
            {user.username}
          </div>
          <div className="text-sm text-white/80">
            Score: {user.totalScore ?? 0}
          </div>
          <div className="text-xs text-white/60 mt-2">
            Status: {statusLabel} • Created: {user.createdAt || "-"}
          </div>
        </div>
        <CrButton
          size="sm"
          color="gold"
          onClick={() => onToggleStatus && onToggleStatus(user.id)}
        >
          {toggleLabel}
        </CrButton>
      </div>
    </div>
  );
}
// ...existing code...
