import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserAssignmentList from "../components/userPage/UserAssignmentList";
import CrButton from "../components/CrButton";
import { authFetch, getAuth, isTokenExpired } from "../utils/auth";
import { Helmet } from "react-helmet-async";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

export default function UserHome() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    try {
      const auth = getAuth();
      if (!auth || isTokenExpired(auth) || auth?.type !== "user") return;
      setUsername(auth?.user?.username || "");
      setUserId(auth?.user?.id || auth?.user?._id || null);
    } catch {
      setUserId(null);
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let mounted = true;
    async function loadAssignments() {
      setLoading(true);
      setError("");
      try {
        const [quizRes, problemRes, quizHistoryRes, problemHistoryRes] =
          await Promise.all([
            authFetch(`${API_BASE_URL}/api/user/${userId}/dashboard/quizzes`),
            authFetch(`${API_BASE_URL}/api/user/${userId}/dashboard/problems`),
            authFetch(`${API_BASE_URL}/api/user/${userId}/history`),
            authFetch(`${API_BASE_URL}/api/user/${userId}/problem-history`),
          ]);

        const quizData = await quizRes.json();
        const problemData = await problemRes.json();
        const quizHistoryData = await quizHistoryRes.json();
        const problemHistoryData = await problemHistoryRes.json();

        if (!quizRes.ok) {
          throw new Error(quizData?.message || "Failed to load quizzes");
        }
        if (!problemRes.ok) {
          throw new Error(problemData?.message || "Failed to load problems");
        }

        if (!quizHistoryRes.ok) {
          throw new Error(
            quizHistoryData?.message || "Failed to load quiz history",
          );
        }
        if (!problemHistoryRes.ok) {
          throw new Error(
            problemHistoryData?.message || "Failed to load problem history",
          );
        }

        const completedQuizIds = new Set(
          (quizHistoryData.quizHistory || []).map((entry) => {
            const id = entry.quizz?._id || entry.quizz;
            return typeof id === "string" ? id : id?.toString?.() || id;
          }),
        );

        const completedProblemIds = new Set(
          (problemHistoryData.problemHistory || []).map((entry) => {
            const id = entry.problem?._id || entry.problem;
            return typeof id === "string" ? id : id?.toString?.() || id;
          }),
        );

        const mappedQuizzes = (quizData.quizzes || []).map((q) => {
          const totalPoints = (q.questions || []).reduce(
            (sum, question) => sum + (question.points || 0),
            0,
          );
          const quizId =
            typeof q._id === "string" ? q._id : q._id?.toString?.() || q._id;
          return {
            id: quizId,
            title: q.title,
            description: q.description || "",
            type: "quiz",
            points: totalPoints,
            completed: completedQuizIds.has(quizId),
          };
        });

        const mappedProblems = (problemData.problems || []).map((p) => {
          const problemId =
            typeof p._id === "string" ? p._id : p._id?.toString?.() || p._id;
          return {
            id: problemId,
            title: p.title,
            description: p.description || "",
            type: "problem",
            points: p.score || 0,
            completed: completedProblemIds.has(problemId),
          };
        });

        if (mounted) {
          setQuizzes(mappedQuizzes);
          setProblems(mappedProblems);
        }
      } catch (err) {
        if (mounted) setError(err.message || "Unable to load assignments");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAssignments();
    return () => {
      mounted = false;
    };
  }, [userId]);

  function handleOpenQuiz(quiz) {
    navigate(`/user/quizzes/${quiz.id}`, { state: { quiz } });
  }

  function handleOpenProblem(problem) {
    navigate(`/user/problems/${problem.id}`, { state: { problem } });
  }

  const assignments = useMemo(() => {
    return [...quizzes, ...problems];
  }, [quizzes, problems]);

  function handleLogout() {
    try {
      localStorage.removeItem("auth");
    } catch {}
    navigate("/");
  }

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950">
      <Helmet>
        <title>User Home - Digital Minds</title>
      </Helmet>
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-luckiest tracking-wide ">
              Welcome{username ? `, ${username}` : ""}
            </h1>
            <p className="text-sm text-white/70">
              Choose a quiz or problem to start.
            </p>
          </div>
          <div>
            <CrButton color="red" onClick={handleLogout} size="sm">
              Logout
            </CrButton>
          </div>
        </header>

        {error && (
          <div className="mb-4 rounded bg-red-500/10 border border-red-500/30 p-3 text-red-200">
            {error}
          </div>
        )}

        {!userId ? (
          <div className="p-6 bg-white/5 rounded-lg text-center text-white/70">
            Please sign in to see your assignments.
          </div>
        ) : loading ? (
          <div className="p-6 bg-white/5 rounded-lg text-center text-white/70">
            Loading assignments...
          </div>
        ) : (
          <UserAssignmentList
            assignments={assignments}
            onOpenQuiz={handleOpenQuiz}
            onOpenProblem={handleOpenProblem}
          />
        )}
      </div>
    </div>
  );
}
