import React, { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import CrButton from "../CrButton";
import { useNavigate } from "react-router-dom";
import { FaLongArrowAltRight, FaLongArrowAltLeft } from "react-icons/fa";

export default function UsersTable({
  users = [],
  loading = false,
  onDelete,
  onToggleStatus,
  pageSize = 8,
}) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [users]);

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const pageUsers = useMemo(
    () => users.slice(startIndex, startIndex + pageSize),
    [users, startIndex, pageSize],
  );

  if (loading) {
    return (
      <div className="p-6 bg-white/5 rounded text-white/70">
        Loading users...
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="p-6 bg-white/5 rounded text-white/70">
        No users found.
      </div>
    );
  }

  return (
    <div className="bg-white/5 rounded border border-white/6 overflow-hidden p-4">
      <table className="min-w-full divide-y divide-white/8">
        <thead className="bg-white/3 text-white/80">
          <tr>
            <th className="px-4 py-3 text-left text-sm">Username</th>
            <th className="px-4 py-3 text-left text-sm">Score</th>
            <th className="px-4 py-3 text-left text-sm">Status</th>
            <th className="px-4 py-3 text-left text-sm">Created</th>
            <th className="px-4 py-3 text-right text-sm">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/6">
          {pageUsers.map((u) => (
            <tr key={u.id} className="hover:bg-white/2">
              <td className="px-4 py-3">
                <div className="font-medium text-white">{u.username}</div>
              </td>
              <td className="px-4 py-3 text-white">{u.totalScore}</td>
              <td className="px-4 py-3 text-white">
                {u.isActive ? "Active" : "Inactive"}
              </td>
              <td className="px-4 py-3 text-white">{u.createdAt}</td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex items-center gap-2">
                  <CrButton
                    onClick={() =>
                      navigate(`/admin/users/${u.id}`, { state: { user: u } })
                    }
                    title="View User"
                    color="blue"
                    size="sm"
                  >
                    <FiEye />
                  </CrButton>
                  <CrButton
                    onClick={() => onToggleStatus && onToggleStatus(u.id)}
                    title="Toggle status"
                    color="gold"
                    size="sm"
                  >
                    <FiEdit2 />
                  </CrButton>
                  <CrButton
                    onClick={() => onDelete && onDelete(u.id)}
                    title="Delete user"
                    color="red"
                    size="sm"
                  >
                    <FiTrash2 />
                  </CrButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex items-center justify-between text-sm text-white/70">
        <div>
          Showing {startIndex + 1} -{" "}
          {Math.min(startIndex + pageSize, users.length)} of {users.length}
        </div>
        <div className="flex items-center gap-2">
          <CrButton
            color="blue"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
          >
            <FaLongArrowAltLeft />
          </CrButton>
          <span className="text-white/80">
            Page {safePage} / {totalPages}
          </span>
          <CrButton
            color="blue"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
          >
            <FaLongArrowAltRight />
          </CrButton>
        </div>
      </div>
    </div>
  );
}
