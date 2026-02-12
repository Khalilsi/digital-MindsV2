import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/adminPage/searchBar";
import CrButton from "../components/CrButton";
import UsersTable from "../components/AdminUserManegement/UsersTable";
import NewUserModal from "../components/AdminUserManegement/NewUserModal";
import { Helmet } from "react-helmet-async";
import { authFetch } from "../utils/auth";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

export default function UsersPage() {
  const [query, setQuery] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadUsers() {
      setLoading(true);
      setError("");
      try {
        const response = await authFetch(`${API_BASE_URL}/api/admin/users`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Failed to load users");
        }

        const mapped = (data.users || []).map((user) => ({
          id: user._id,
          username: user.username,
          totalScore: user.totalScore || 0,
          isActive: user.isActive,
          createdAt: user.createdAt ? user.createdAt.slice(0, 10) : "",
        }));

        if (mounted) {
          setUsers(mapped);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Unable to load users");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadUsers();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      (u.username + " " + (u.isActive ? "active" : "inactive"))
        .toLowerCase()
        .includes(q),
    );
  }, [users, query]);

  async function handleCreate(user) {
    try {
      const response = await authFetch(`${API_BASE_URL}/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          password: user.password,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to create user");
      }

      const newUser = {
        id: data.user?.id || data.user?._id,
        username: data.user?.username || user.username,
        totalScore: data.user?.totalScore || 0,
        isActive: data.user?.isActive ?? true,
        createdAt: new Date().toISOString().slice(0, 10),
      };

      setUsers((s) => [newUser, ...s]);
      setShowNew(false);
      if (user.generatedPassword) {
        window.alert(`Generated password: ${user.generatedPassword}`);
      }
    } catch (err) {
      window.alert(err.message || "Failed to create user");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this user?")) return;
    try {
      const response = await authFetch(
        `${API_BASE_URL}/api/admin/users/${id}`,
        {
          method: "DELETE",
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete user");
      }

      setUsers((s) => s.filter((u) => u.id !== id));
    } catch (err) {
      window.alert(err.message || "Failed to delete user");
    }
  }

  async function handleToggleStatus(id) {
    try {
      const response = await authFetch(
        `${API_BASE_URL}/api/admin/users/${id}/toggle-status`,
        { method: "PATCH" },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update user");
      }

      setUsers((s) =>
        s.map((u) =>
          u.id === id
            ? {
                ...u,
                isActive: data.user?.isActive ?? !u.isActive,
              }
            : u,
        ),
      );
    } catch (err) {
      window.alert(err.message || "Failed to update user");
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
      <Helmet>
        <title>Users - Digital Minds</title>
      </Helmet>
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-luckiest">Users</h1>
            <p className="text-sm text-slate-400">
              Manage participants and admin accounts
            </p>
          </div>

          <div className="flex items-center gap-3">
            <CrButton color="blue" size="md" onClick={() => setShowNew(true)}>
              + New User
            </CrButton>
            <div style={{ width: 205 }}>
              <SearchBar value={query} onChange={setQuery} />
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-4 rounded bg-red-500/10 border border-red-500/30 p-3 text-red-200">
            {error}
          </div>
        )}

        <UsersTable
          users={filtered}
          loading={loading}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />

        <NewUserModal
          open={showNew}
          onClose={() => setShowNew(false)}
          onCreate={handleCreate}
        />
      </div>
    </div>
  );
}
