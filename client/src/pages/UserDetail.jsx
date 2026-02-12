// ...existing code...
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import UserProfileCard from "../components/AdminUserManegement/UserProfileCard";
import PasswordGeneratorCard from "../components/AdminUserManegement/PasswordGeneratorCard";
import AssignQuizzesCard from "../components/AdminUserManegement/AssignQuizzesCard";
import AssignedQuizzesList from "../components/AdminUserManegement/AssignedQuizzesList";
import UserResultsCard from "../components/AdminUserManegement/UserResultsCard";
import AssignProblemsCard from "../components/AdminUserManegement/AssignProblemsCard";
import AssignedProblemsList from "../components/AdminUserManegement/AssignedProblemsList";
import ProblemResultsCard from "../components/AdminUserManegement/ProblemResultsCard";
import { Helmet } from "react-helmet-async";
import { authFetch } from "../utils/auth";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

export default function UserDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const [user, setUser] = useState(state?.user || null);
  const [assigned, setAssigned] = useState([]);
  const [results, setResults] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [problems, setProblems] = useState([]);
  const [assignedProblems, setAssignedProblems] = useState([]);
  const [problemResults, setProblemResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      setLoading(true);
      setError("");
      try {
        const [userRes, quizzesRes, problemsRes] = await Promise.all([
          authFetch(`${API_BASE_URL}/api/admin/users/${id}`),
          authFetch(`${API_BASE_URL}/api/admin/quizzes`),
          authFetch(`${API_BASE_URL}/api/admin/problems`),
        ]);

        const userData = await userRes.json();
        const quizzesData = await quizzesRes.json();
        const problemsData = await problemsRes.json();

        if (!userRes.ok) {
          throw new Error(userData?.message || "Failed to load user");
        }

        if (!quizzesRes.ok) {
          throw new Error(quizzesData?.message || "Failed to load quizzes");
        }

        if (!problemsRes.ok) {
          throw new Error(problemsData?.message || "Failed to load problems");
        }

        const userPayload = userData.user;
        const mappedUser = {
          id: userPayload._id,
          username: userPayload.username,
          totalScore: userPayload.totalScore || 0,
          isActive: userPayload.isActive,
          createdAt: userPayload.createdAt
            ? userPayload.createdAt.slice(0, 10)
            : "",
          assignedQuizzes: userPayload.assignedQuizzes || [],
          assignedProblems: userPayload.assignedProblems || [],
          quizHistory: userPayload.quizHistory || [],
          problemHistory: userPayload.problemHistory || [],
        };

        const mappedQuizzes = (quizzesData.quizzes || []).map((q) => ({
          id: q._id,
          title: q.title,
        }));

        const mappedProblems = (problemsData.problems || []).map((p) => ({
          id: p._id,
          title: p.title,
        }));

        if (mounted) {
          setUser(mappedUser);
          setQuizzes(mappedQuizzes);
          setProblems(mappedProblems);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Unable to load user");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadUser();
    return () => {
      mounted = false;
    };
  }, [id]);

  const assignedList = useMemo(() => {
    if (!user) return [];
    return (user.assignedQuizzes || []).map((quizId) => {
      const quizKey =
        typeof quizId === "string" ? quizId : quizId?.toString?.() || quizId;
      const match = quizzes.find((q) => q.id === quizKey);
      return {
        id: quizKey,
        quizId: quizKey,
        title: match?.title || quizId,
      };
    });
  }, [quizzes, user]);

  const assignedProblemList = useMemo(() => {
    if (!user) return [];
    return (user.assignedProblems || []).map((problemId) => {
      const problemKey =
        typeof problemId === "string"
          ? problemId
          : problemId?.toString?.() || problemId;
      const match = problems.find((p) => p.id === problemKey);
      return {
        id: problemKey,
        problemId: problemKey,
        title: match?.title || problemId,
      };
    });
  }, [problems, user]);

  useEffect(() => {
    if (!user) return;
    const history = (user.quizHistory || []).map((entry) => ({
      id:
        entry._id || `${entry.quizz?._id || entry.quizz}-${entry.completedAt}`,
      quizTitle: entry.quizz?.title || "Quiz",
      score: entry.score || 0,
      takenAt: entry.completedAt ? entry.completedAt.slice(0, 10) : "-",
      answers: entry.answers || [],
    }));
    setResults(history);
    setAssigned(assignedList);
    const problemHistory = (user.problemHistory || []).map((entry) => ({
      id:
        entry._id ||
        `${entry.problem?._id || entry.problem}-${entry.submittedAt}`,
      problemTitle: entry.problem?.title || "Problem",
      problemDescription: entry.problem?.description || "",
      score: entry.scoreEarned || 0,
      userAnswer: entry.userAnswer || "",
      isCorrect: entry.isCorrect,
      submittedAt: entry.submittedAt ? entry.submittedAt.slice(0, 10) : "-",
    }));
    setProblemResults(problemHistory);
    setAssignedProblems(assignedProblemList);
  }, [assignedList, assignedProblemList, user]);

  function handleGeneratePassword(pw) {
    // pw: returned from server — show toast/copy. placeholder returns pw
    console.log("generated pw", pw);
  }

  async function handleAssignQuizzes(selectedIds) {
    if (!selectedIds.length) return;
    try {
      const currentIds = user?.assignedQuizzes || [];
      const nextIds = Array.from(new Set([...currentIds, ...selectedIds]));
      const response = await authFetch(
        `${API_BASE_URL}/api/admin/users/${id}/assign-quizzes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizIds: nextIds }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to assign quizzes");
      }
      setUser((prev) =>
        prev
          ? { ...prev, assignedQuizzes: data.assignedQuizzes || nextIds }
          : prev,
      );
    } catch (err) {
      window.alert(err.message || "Failed to assign quizzes");
    }
  }

  async function handleUnassign(quizId) {
    if (!user) return;
    const nextIds = (user.assignedQuizzes || []).filter((idItem) => {
      const key =
        typeof idItem === "string" ? idItem : idItem?.toString?.() || idItem;
      return key !== quizId;
    });
    try {
      const response = await authFetch(
        `${API_BASE_URL}/api/admin/users/${id}/assign-quizzes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizIds: nextIds }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to unassign quiz");
      }
      setUser((prev) =>
        prev
          ? { ...prev, assignedQuizzes: data.assignedQuizzes || nextIds }
          : prev,
      );
    } catch (err) {
      window.alert(err.message || "Failed to unassign quiz");
    }
  }

  async function handleAssignProblems(selectedIds) {
    if (!selectedIds.length) return;
    try {
      const currentIds = user?.assignedProblems || [];
      const nextIds = Array.from(new Set([...currentIds, ...selectedIds]));
      const response = await authFetch(
        `${API_BASE_URL}/api/admin/users/${id}/assign-problems`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ problemIds: nextIds }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to assign problems");
      }
      setUser((prev) =>
        prev
          ? { ...prev, assignedProblems: data.assignedProblems || nextIds }
          : prev,
      );
    } catch (err) {
      window.alert(err.message || "Failed to assign problems");
    }
  }

  async function handleUnassignProblem(problemId) {
    if (!user) return;
    const nextIds = (user.assignedProblems || []).filter((idItem) => {
      const key =
        typeof idItem === "string" ? idItem : idItem?.toString?.() || idItem;
      return key !== problemId;
    });
    try {
      const response = await authFetch(
        `${API_BASE_URL}/api/admin/users/${id}/assign-problems`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ problemIds: nextIds }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to unassign problem");
      }
      setUser((prev) =>
        prev
          ? { ...prev, assignedProblems: data.assignedProblems || nextIds }
          : prev,
      );
    } catch (err) {
      window.alert(err.message || "Failed to unassign problem");
    }
  }

  async function handleToggleStatus() {
    try {
      const response = await authFetch(
        `${API_BASE_URL}/api/admin/users/${id}/toggle-status`,
        { method: "PATCH" },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to update user");
      }
      setUser((prev) =>
        prev
          ? { ...prev, isActive: data.user?.isActive ?? !prev.isActive }
          : prev,
      );
    } catch (err) {
      window.alert(err.message || "Failed to update user");
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
      <Helmet>
        <title>User Detail - Digital Minds</title>
      </Helmet>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {error && (
          <div className="lg:col-span-3 rounded bg-red-500/10 border border-red-500/30 p-3 text-red-200">
            {error}
          </div>
        )}
        <div className="lg:col-span-1 space-y-6">
          <UserProfileCard user={user} onToggleStatus={handleToggleStatus} />
          <PasswordGeneratorCard
            userId={id}
            onGenerated={handleGeneratePassword}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="p-4 bg-white/5 rounded border border-white/6">
            <h2 className="text-lg font-semibold mb-3">Assign quizzes</h2>
            <AssignQuizzesCard
              availableQuizzes={quizzes}
              assignedQuizIds={(user?.assignedQuizzes || []).map((quizId) =>
                typeof quizId === "string"
                  ? quizId
                  : quizId?.toString?.() || quizId,
              )}
              loadingList={loading}
              onAssign={handleAssignQuizzes}
            />
          </div>

          <AssignedQuizzesList
            assignments={assigned}
            onUnassign={handleUnassign}
          />
          <UserResultsCard userId={id} results={results} />

          <div className="p-4 bg-white/5 rounded border border-white/6">
            <h2 className="text-lg font-semibold mb-3">Assign problems</h2>
            <AssignProblemsCard
              availableProblems={problems}
              assignedProblemIds={(user?.assignedProblems || []).map(
                (problemId) =>
                  typeof problemId === "string"
                    ? problemId
                    : problemId?.toString?.() || problemId,
              )}
              loadingList={loading}
              onAssign={handleAssignProblems}
            />
          </div>

          <AssignedProblemsList
            assignments={assignedProblems}
            onUnassign={handleUnassignProblem}
          />
          <ProblemResultsCard results={problemResults} />
        </div>
      </div>
    </div>
  );
}
// ...existing code...
