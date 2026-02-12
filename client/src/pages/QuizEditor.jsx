import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import QuizHeader from "../components/QuizEdit/QuizHeader";
import QuestionList from "../components/QuizEdit/QuestionList";
import QuestionEditor from "../components/QuizEdit/QuestionEditor";
import { DragDropContext } from "@hello-pangea/dnd";
import { Helmet } from "react-helmet-async";
import { authFetch } from "../utils/auth";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

export default function QuizEditor() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const initial = {
    id: id === "new" ? null : id,
    title: state?.title || state?.quiz?.title || "Untitled Quiz",
    type: state?.type || state?.quiz?.type || "classic",
    questions: state?.quiz?.questions || [],
  };

  const [quiz, setQuiz] = useState(initial);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function stripHtml(html = "") {
    return html.replace(/<[^>]+>/g, "");
  }

  function mapApiQuizToUi(apiQuiz) {
    return {
      id: apiQuiz._id,
      title: apiQuiz.title,
      type: "classic",
      questions: (apiQuiz.questions || []).map((question, index) => {
        const qid = question._id || `${apiQuiz._id}-${index}`;
        const choices = (question.propositions || []).map((text, idx) => ({
          id: `${qid}-c${idx}`,
          text,
        }));
        const correctChoice = choices[question.correctAnswer];
        return {
          id: qid,
          prompt: question.question || "",
          type: "single",
          choices,
          correct: correctChoice ? [correctChoice.id] : [],
          points: question.points || 1,
        };
      }),
    };
  }

  function mapUiQuizToApi(uiQuiz) {
    const questions = (uiQuiz.questions || []).map((question) => {
      const choices = question.choices || [];
      const propositions = choices.map((choice) => choice.text);
      const correctId = (question.correct || [])[0];
      const correctIndex = choices.findIndex(
        (choice) => choice.id === correctId,
      );
      return {
        question: question.prompt || "",
        propositions,
        correctAnswer: correctIndex >= 0 ? correctIndex : 0,
        points: question.points || 1,
      };
    });

    return {
      title: uiQuiz.title,
      description: "",
      duration: 30,
      questions,
    };
  }

  useEffect(() => {
    setQuiz(initial);
  }, [id]);

  useEffect(() => {
    if (id === "new") return;

    let mounted = true;
    async function loadQuiz() {
      setLoading(true);
      setError("");
      try {
        const response = await authFetch(
          `${API_BASE_URL}/api/admin/quizzes/${id}`,
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || "Failed to load quiz");
        }
        const mapped = mapApiQuizToUi(data.quizz);
        if (mounted) {
          setQuiz(mapped);
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
  }, [id]);

  function changeTitle(t) {
    setQuiz((q) => ({ ...q, title: t }));
  }

  function addQuestion() {
    const ts = Date.now().toString();
    const newDraft = {
      id: ts,
      prompt: "",
      type: "single",
      choices: [
        { id: ts + "-c1", text: "" },
        { id: ts + "-c2", text: "" },
      ],
      correct: [],
      points: 1,
    };
    setDraft(newDraft);
    setEditingId(ts);
  }

  function startEdit(qid) {
    const q = quiz.questions.find((x) => x.id === qid);
    setDraft(q ? JSON.parse(JSON.stringify(q)) : null);
    setEditingId(qid);
  }

  function handleSaveQuestion(updated) {
    setQuiz((prev) => {
      const exists = prev.questions.find((q) => q.id === updated.id);
      let newQuestions;
      if (exists) {
        newQuestions = prev.questions.map((q) =>
          q.id === updated.id ? updated : q,
        );
      } else {
        newQuestions = [...prev.questions, updated];
      }
      return { ...prev, questions: newQuestions };
    });
    setDraft(null);
    setEditingId(null);
  }

  function deleteQuestion(qid) {
    if (!window.confirm("Delete this question?")) return;
    setQuiz((q) => ({
      ...q,
      questions: q.questions.filter((x) => x.id !== qid),
    }));
    if (editingId === qid) {
      setEditingId(null);
      setDraft(null);
    }
  }

  async function handleSave() {
    const titleText = (quiz.title || "").trim();
    if (!titleText) {
      setError("Quiz title is required.");
      return;
    }
    if (!quiz.questions || quiz.questions.length === 0) {
      setError("Add at least one question before saving.");
      return;
    }
    const invalidQuestion = (quiz.questions || []).find((question) => {
      const promptText = stripHtml(question.prompt || "").trim();
      if (!promptText) return true;
      if (question.type === "single" || question.type === "multiple") {
        if (!question.choices || question.choices.length < 2) return true;
        const hasEmptyChoice = question.choices.some(
          (choice) => !choice.text || !choice.text.trim(),
        );
        if (hasEmptyChoice) return true;
      }
      return false;
    });
    if (invalidQuestion) {
      setError("Each question needs a prompt and at least two filled choices.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = mapUiQuizToApi(quiz);
      const url = quiz.id
        ? `${API_BASE_URL}/api/admin/quizzes/${quiz.id}`
        : `${API_BASE_URL}/api/admin/quizzes`;
      const method = quiz.id ? "PUT" : "POST";
      const response = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to save quiz");
      }
      const saved = mapApiQuizToUi(data.quizz || data.quiz || data);
      setQuiz(saved);
      if (!quiz.id && saved.id) {
        navigate(`/admin/quizzes/${saved.id}/edit`, {
          replace: true,
          state: { quiz: saved },
        });
      }
    } catch (err) {
      setError(err.message || "Failed to save quiz");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    navigate("/admin/quizzes");
  }
  function onDragEnd(result) {
    if (!result.destination) return;
    const src = result.source.index;
    const dest = result.destination.index;
    if (src === dest) return;

    setQuiz((prev) => {
      const questions = Array.from(prev.questions);
      const [moved] = questions.splice(src, 1);
      questions.splice(dest, 0, moved);
      return { ...prev, questions };
    });
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
      <Helmet>
        <title>Quiz Editor - Digital Minds</title>
      </Helmet>
      <div className="max-w-6xl mx-auto">
        {error && (
          <div className="mb-4 rounded bg-red-500/10 border border-red-500/30 p-3 text-red-200">
            {error}
          </div>
        )}
        <QuizHeader
          title={quiz.title}
          type={quiz.type}
          onChangeTitle={changeTitle}
          onSave={handleSave}
          onCancel={handleCancel}
          saving={saving}
        />
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <QuestionList
                questions={quiz.questions}
                onAdd={addQuestion}
                onEdit={startEdit}
                onDelete={deleteQuestion}
              />
            </div>

            <div className="lg:col-span-2">
              {loading ? (
                <div className="p-6 bg-white/5 rounded text-white/70">
                  Loading quiz...
                </div>
              ) : (
                <QuestionEditor
                  question={draft}
                  onSave={handleSaveQuestion}
                  onClose={() => {
                    setDraft(null);
                    setEditingId(null);
                  }}
                />
              )}
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
