import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/adminPage/searchBar";
import QuizGrid from "../components/adminPage/QuizGrid";
import QuizList from "../components/adminPage/QuizList";
import { MdGridOn } from "react-icons/md";
import { FaList } from "react-icons/fa";
import CrButton from "../components/CrButton";
import CreateTypeModal from "../components/adminPage/CreateTypeModal";
import CreateTitleModal from "../components/adminPage/CreateTitleModal";
import { Helmet } from "react-helmet-async";
import { authFetch } from "../utils/auth";
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

export default function AdminMainPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");
  const [tab, setTab] = useState("quizzes");
  const [quizzes, setQuizzes] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadAll() {
      setLoading(true);
      setError("");
      try {
        const [quizRes, problemRes] = await Promise.all([
          authFetch(`${API_BASE_URL}/api/admin/quizzes`),
          authFetch(`${API_BASE_URL}/api/admin/problems`),
        ]);

        const quizData = await quizRes.json();
        const problemData = await problemRes.json();

        if (!quizRes.ok) {
          throw new Error(quizData?.message || "Failed to load quizzes");
        }
        if (!problemRes.ok) {
          throw new Error(problemData?.message || "Failed to load problems");
        }

        const mappedQuizzes = (quizData.quizzes || []).map((q) => ({
          id: q._id,
          title: q.title,
          questionsCount: q.questions?.length || 0,
          isActive: q.isActive,
          createdAt: q.createdAt ? q.createdAt.slice(0, 10) : "",
        }));

        const mappedProblems = (problemData.problems || []).map((p) => ({
          id: p._id,
          title: p.title,
          score: p.score,
          isActive: p.isActive,
          createdAt: p.createdAt ? p.createdAt.slice(0, 10) : "",
        }));

        if (mounted) {
          setQuizzes(mappedQuizzes);
          setProblems(mappedProblems);
        }
      } catch (err) {
        if (mounted) setError(err.message || "Unable to load data");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAll();
    return () => {
      mounted = false;
    };
  }, []);
  const filtered = useMemo(() => {
    const list = tab === "quizzes" ? quizzes : problems;
    return list.filter((item) =>
      item.title.toLowerCase().includes(query.trim().toLowerCase()),
    );
  }, [quizzes, problems, query, tab]);

  function handleCreate() {
    setShowTypeModal(true);
  }
  function handleTypeSelect(type) {
    setShowTypeModal(false);
    setSelectedType(type);
    setShowTitleModal(true);
  }

  function handleTitleConfirm(title) {
    const clean = title.trim();
    if (!clean) return;
    if (selectedType === "problem") {
      navigate("/admin/problems/new", { state: { title: clean } });
    } else {
      navigate("/admin/quizzes/new/edit", {
        state: { title: clean, type: "classic" },
      });
    }
    setShowTitleModal(false);
    setSelectedType(null);
  }

  async function handleDelete(id) {
    const label = tab === "quizzes" ? "quiz" : "problem";
    if (!window.confirm(`Delete this ${label}?`)) return;
    try {
      const endpoint = tab === "quizzes" ? "quizzes" : "problems";
      const response = await authFetch(
        `${API_BASE_URL}/api/admin/${endpoint}/${id}`,
        {
          method: "DELETE",
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || `Failed to delete ${label}`);
      }
      if (tab === "quizzes") {
        setQuizzes((s) => s.filter((q) => q.id !== id));
      } else {
        setProblems((s) => s.filter((p) => p.id !== id));
      }
    } catch (err) {
      window.alert(err.message || `Failed to delete ${label}`);
    }
  }

  function handleEdit(item) {
    if (tab === "quizzes") {
      navigate(`/admin/quizzes/${item.id}/edit`, { state: { quiz: item } });
    } else {
      navigate(`/admin/problems/${item.id}/edit`, { state: { problem: item } });
    }
  }

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 relative">
      <Helmet>
        <title>Admin Dashboard - Digital Minds</title>
      </Helmet>
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.25),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(250,204,21,0.15),transparent_45%)]" />
      <div className="p-6 max-w-5xl mx-auto relative">
        <header className="flex items-center justify-between mb-6">
          <CrButton onClick={handleCreate} color="blue" size="md">
            &#43; Create
          </CrButton>

          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-md overflow-hidden border border-white/10">
              <button
                className={`px-3 py-2 text-sm ${tab === "quizzes" ? "bg-white/10" : "bg-transparent"}`}
                onClick={() => setTab("quizzes")}
              >
                Quizzes
              </button>
              <button
                className={`px-3 py-2 text-sm ${tab === "problems" ? "bg-white/10" : "bg-transparent"}`}
                onClick={() => setTab("problems")}
              >
                Problems
              </button>
            </div>
            <div className="inline-flex rounded-md overflow-hidden border border-white/10">
              <button
                className={`px-3 py-2 text-sm ${view === "grid" ? "bg-white/10" : "bg-transparent"}`}
                onClick={() => setView("grid")}
              >
                <MdGridOn className="w-5 h-5" />
              </button>
              <button
                className={`px-3 py-2 text-sm ${view === "list" ? "bg-white/10" : "bg-transparent"}`}
                onClick={() => setView("list")}
              >
                <FaList className="w-5 h-5" />
              </button>
            </div>
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder={
                tab === "quizzes" ? "Search quizzes..." : "Search problems..."
              }
            />
          </div>
        </header>

        <section>
          <h1 className="text-2xl mb-4 font-luckiest">
            {tab === "quizzes" ? "Created Quizzes" : "Created Problems"}
          </h1>

          {error && (
            <div className="mb-4 rounded bg-red-500/10 border border-red-500/30 p-3 text-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-6 bg-white/5 rounded-lg text-center text-white/70">
              Loading...
            </div>
          ) : view === "grid" ? (
            <QuizGrid
              quizzes={filtered}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ) : (
            <QuizList
              quizzes={filtered}
              onDelete={handleDelete}
              onEdit={handleEdit}
              showAnalyze={tab === "quizzes"}
            />
          )}
        </section>
      </div>
      <CreateTypeModal
        open={showTypeModal}
        onClose={() => setShowTypeModal(false)}
        onSelect={handleTypeSelect}
      />
      <CreateTitleModal
        open={showTitleModal}
        onClose={() => setShowTitleModal(false)}
        onConfirm={handleTitleConfirm}
        defaultType={selectedType}
      />
    </div>
  );
}
