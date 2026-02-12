import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import CrButton from "../CrButton";

export default function NewUserModal({ open, onClose, onCreate }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [generatePassword, setGeneratePassword] = useState(true);

  useEffect(() => {
    if (open) {
      setUsername("");
      setPassword("");
      setGeneratePassword(true);
    }
  }, [open]);

  function handleConfirm() {
    if (!username.trim()) {
      alert("Username is required");
      return;
    }
    let finalPassword = password;
    if (generatePassword) {
      finalPassword = Math.random().toString(36).slice(2, 10);
    }
    if (!finalPassword) {
      alert("Password is required");
      return;
    }
    const payload = {
      username: username.trim(),
      password: finalPassword,
      generatedPassword: generatePassword ? finalPassword : null,
    };
    onCreate && onCreate(payload);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create new user"
      footer={
        <>
          <CrButton onClick={onClose} color="red">
            Cancel
          </CrButton>
          <CrButton onClick={handleConfirm} color="gold">
            Create
          </CrButton>
        </>
      }
    >
      <div className="space-y-3">
        <label className="block text-sm text-white/80">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 rounded bg-white/5 text-white focus:outline-none"
        />

        <label className="flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={generatePassword}
            onChange={(e) => setGeneratePassword(e.target.checked)}
          />
          Generate password automatically
        </label>

        {!generatePassword && (
          <>
            <label className="block text-sm text-white/80">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded bg-white/5 text-white focus:outline-none"
            />
          </>
        )}
      </div>
    </Modal>
  );
}
