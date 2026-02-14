import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CrButton from "../components/CrButton";
import { authFetch, getAuth, isTokenExpired } from "../utils/auth";
import { Helmet } from "react-helmet-async";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

export default function UserProblemTake() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(state?.problem || null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const userId = useMemo(() => {
    try {
      const auth = getAuth();
      if (!auth || isTokenExpired(auth) || auth?.type !== "user") return null;
      return auth?.user?.id || auth?.user?._id || null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      setError("Please sign in to answer this problem.");
      setLoading(false);
      return;
    }

    let mounted = true;
    async function loadProblem() {
      setLoading(true);
      setError("");
      try {
        const response = await authFetch(
          `${API_BASE_URL}/api/user/${userId}/dashboard/problems`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Failed to load problem");
        }

        const found = (data.problems || []).find((p) => p._id === id);
        if (!found) {
          throw new Error("Problem not found or not assigned to you.");
        }

        if (mounted) {
          setProblem(found);
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
  }, [id, userId]);

  async function handleSubmit() {
    if (!problem) return;
    if (!answer.trim()) {
      setError("Please write your solution before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const payload = {
        userId,
        problemId: problem._id,
        userAnswer: answer.trim(),
      };

      const response = await authFetch(
        `${API_BASE_URL}/api/user/problems/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to submit problem");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to submit problem");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950">
      <Helmet>
        <title>Take Problem - Digital Minds</title>
      </Helmet>
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <CrButton
            color="red"
            size="sm"
            onClick={() => navigate("/user/home")}
            className="w-full sm:w-auto"
          >
            Back
          </CrButton>
        </div>
        {error && (
          <div className="mb-4 rounded bg-red-500/10 border border-red-500/30 p-3 text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-6 bg-white/5 rounded border border-white/10 text-white/70">
            Loading problem...
          </div>
        ) : submitted ? (
          <div className="p-5 sm:p-6 bg-white/5 rounded border border-white/10">
            <h1 className="text-xl sm:text-2xl font-luckiest">
              Submission received
            </h1>
            <p className="text-sm text-white/70 mt-2">
              Your answer was sent successfully. Results will be reviewed by the
              admin.
            </p>
          </div>
        ) : (
          <div className="p-5 sm:p-6 bg-white/5 rounded border border-white/10">
            <h1 className="text-xl sm:text-2xl font-luckiest">
              {problem?.title || "Problem"}
            </h1>
            {problem?.description && (
              <div
                className="text-sm text-white/70 mt-2 whitespace-pre-wrap rich-content"
                dangerouslySetInnerHTML={{ __html: problem.description }}
              />
            )}

            <div className="mt-5 sm:mt-6">
              <label className="block text-sm text-white/80 mb-2">
                Your solution
              </label>
              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                rows={7}
                className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                placeholder="Write your answer here..."
              />
            </div>

            <div className="mt-5 sm:mt-6 flex justify-end">
              <CrButton
                color="gold"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </CrButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
