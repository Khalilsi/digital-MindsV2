import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CrButton from "../components/CrButton";
import RichTextEditor from "../components/QuizEdit/RichTextEditor ";
import { Helmet } from "react-helmet-async";
import { authFetch } from "../utils/auth";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

export default function ProblemForm() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState(
    state?.problem?.title || state?.title || "",
  );
  const [description, setDescription] = useState("");
  const [score, setScore] = useState(state?.problem?.score || 10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function stripHtml(html = "") {
    return html.replace(/<[^>]+>/g, "");
  }

  useEffect(() => {
    if (!id || id === "new") return;
    let mounted = true;

    async function loadProblem() {
      setLoading(true);
      setError("");
      try {
        const response = await authFetch(
          `${API_BASE_URL}/api/admin/problems/${id}`,
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || "Failed to load problem");
        }
        if (mounted) {
          setTitle(data.problem.title || "");
          setDescription(data.problem.description || "");
          setScore(data.problem.score || 10);
        }
      } catch (err) {
        if (mounted) setError(err.message || "Unable to load problem");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProblem();
    return () => {
      mounted = false;
    };
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    const titleText = title.trim();
    const descriptionText = stripHtml(description || "").trim();
    if (!titleText || !descriptionText) {
      setError("Title and description are required.");
      return;
    }
    if (Number(score) < 0 || Number.isNaN(Number(score))) {
      setError("Points must be 0 or greater.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const payload = {
        title: titleText,
        description: description.trim(),
        score: Number(score) || 0,
      };
      const url =
        !id || id === "new"
          ? `${API_BASE_URL}/api/admin/problems`
          : `${API_BASE_URL}/api/admin/problems/${id}`;
      const method = !id || id === "new" ? "POST" : "PUT";
      const response = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to save problem");
      }
      if (!id || id === "new") {
        const savedId = data.problem?.id || data.problem?._id;
        if (savedId) {
          navigate(`/admin/problems/${savedId}/edit`, {
            replace: true,
            state: { problem: data.problem },
          });
        } else {
          navigate("/admin/quizzes");
        }
      }
    } catch (err) {
      setError(err.message || "Failed to save problem");
    } finally {
      setLoading(false);
    }
  }

  const isValid = title.trim() && description.trim();

  return (
    <>
      <Helmet>
        <title>Problem Form - Digital Minds</title>
      </Helmet>
      <div className="min-h-screen text-white bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-28 pt-7 max-w-full mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded bg-red-500/10 border border-red-500/30 p-3 text-red-200">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm text-white/80 mb-1">
              Problem Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sum of Two Numbers"
              className="w-full px-4 py-2 rounded bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
              required
            />
          </div>

          {/* Description - Rich Text Editor */}
          <div>
            <label className="block text-sm text-white/80 mb-1">
              Problem Description *
            </label>
            <div className="rounded border border-white/10 overflow-hidden ">
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Write the problem statement here..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-1">Points *</label>
            <input
              type="number"
              min="0"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full px-4 py-2 rounded bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
              required
            />
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-center">
            <CrButton type="submit" color="gold" disabled={!isValid || loading}>
              {loading ? "Saving..." : "Save Problem"}
            </CrButton>
          </div>
        </form>
      </div>
    </>
  );
}
