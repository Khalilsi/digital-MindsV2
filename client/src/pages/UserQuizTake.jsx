import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CrButton from "../components/CrButton";
import { authFetch, getAuth, isTokenExpired } from "../utils/auth";
import { Helmet } from "react-helmet-async";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

function stripHtml(html = "") {
  return html.replace(/<[^>]+>/g, "");
}

/** Render HTML content safely with Tailwind prose-like styles */
function HtmlContent({ html, className = "" }) {
  const clean = (html || "").trim();
  if (!clean || stripHtml(clean) === "") return null;
  return (
    <div
      className={`rich-content ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

export default function UserQuizTake() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(state?.quiz || null);
  const [answers, setAnswers] = useState([]);
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
      setError("Please sign in to take this quiz.");
      setLoading(false);
      return;
    }

    let mounted = true;

    async function loadQuiz() {
      setLoading(true);
      setError("");
      try {
        const response = await authFetch(
          `${API_BASE_URL}/api/user/${userId}/dashboard/quizzes`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Failed to load quiz");
        }

        const found = (data.quizzes || []).find((q) => q._id === id);
        if (!found) {
          throw new Error("Quiz not found or not assigned to you.");
        }

        if (mounted) {
          setQuiz(found);
          setAnswers(new Array(found.questions?.length || 0).fill(null));
        }
      } catch (err) {
        if (mounted) setError(err.message || "Unable to load quiz");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadQuiz();
    return () => {
      mounted = false;
    };
  }, [id, userId]);

  function handleSelect(questionIndex, optionIndex) {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      return next;
    });
  }

  async function handleSubmit() {
    if (!quiz) return;
    const answeredCount = answers.filter(
      (value) => value !== null && value !== undefined,
    ).length;
    const hasMissing = answeredCount < answers.length;

    if (answeredCount === 0) {
      setError("Please answer at least one question before submitting.");
      return;
    }

    if (hasMissing) {
      const confirmSubmit = window.confirm(
        "Some questions are unanswered. Do you want to submit anyway?",
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const payload = {
        userId,
        quizzId: quiz._id,
        answers: answers.map((selectedAnswer, questionIndex) => ({
          questionIndex,
          selectedAnswer,
        })),
      };

      const response = await authFetch(
        `${API_BASE_URL}/api/user/quizzes/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to submit quiz");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950">
      <Helmet>
        <title>Take Quiz - Digital Minds</title>
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
            Loading quiz...
          </div>
        ) : submitted ? (
          <div className="p-5 sm:p-6 bg-white/5 rounded border border-white/10">
            <h1 className="text-xl sm:text-2xl font-luckiest">
              Quiz submitted
            </h1>
            <p className="text-sm text-white/70 mt-2">
              Your answers were sent successfully. Results will be reviewed by
              the admin.
            </p>
          </div>
        ) : (
          <div className="p-5 sm:p-6 bg-white/5 rounded border border-white/10">
            <h1 className="text-xl sm:text-2xl font-luckiest">
              {quiz?.title || "Quiz"}
            </h1>
            {quiz?.description && (
              <div
                className="text-sm text-white/70 mt-2 rich-content"
                dangerouslySetInnerHTML={{ __html: quiz.description }}
              />
            )}

            <div className="mt-5 sm:mt-6 space-y-5 sm:space-y-6">
              {(quiz?.questions || []).map((question, questionIndex) => (
                <div
                  key={`${quiz._id}-${questionIndex}`}
                  className="p-4 sm:p-5 bg-white/5 rounded border border-white/10"
                >
                  <div className="text-sm text-white/70 mb-2">
                    Question {questionIndex + 1}
                  </div>
                  <div className="text-white mb-3 sm:mb-4">
                    {stripHtml(question.question || "").trim() ? (
                      <HtmlContent html={question.question} />
                    ) : (
                      "Untitled question"
                    )}
                  </div>
                  <div className="space-y-2">
                    {(question.propositions || []).map(
                      (option, optionIndex) => (
                        <label
                          key={`${quiz._id}-${questionIndex}-${optionIndex}`}
                          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10"
                        >
                          <input
                            type="radio"
                            className="sr-only peer"
                            name={`q-${questionIndex}`}
                            checked={answers[questionIndex] === optionIndex}
                            onChange={() =>
                              handleSelect(questionIndex, optionIndex)
                            }
                          />
                          <span className="h-5 w-5 shrink-0 rounded-full border-2 border-white/40 bg-white/10 shadow-inner transition peer-checked:border-emerald-400 peer-checked:bg-emerald-400/20 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-300" />
                          <span className="text-white/90 text-sm sm:text-base">
                            {option}
                          </span>
                        </label>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 sm:mt-6 flex justify-end">
              <CrButton
                color="gold"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </CrButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
