import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import QuizHeader from '../components/QuizEdit/QuizHeader'
import QuestionList from '../components/QuizEdit/QuestionList'
import QuestionEditor from '../components/QuizEdit/QuestionEditor'

export default function QuizEditor() {
  const { id } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const initial = state?.quiz || { id, title: 'Untitled Quiz', type: 'classic', questions: [] }

  const [quiz, setQuiz] = useState(initial)
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setQuiz(initial)
  }, [id])

  function changeTitle(t) { setQuiz((q) => ({ ...q, title: t })) }

  function addQuestion() {
    const ts = Date.now().toString()
    const newDraft = {
      id: ts,
      prompt: '',
      type: 'single',
      choices: [
        { id: ts + '-c1', text: '' },
        { id: ts + '-c2', text: '' }
      ],
      correct: []
    }
    setDraft(newDraft)
    setEditingId(ts)
  }

  function startEdit(qid) {
    const q = quiz.questions.find((x) => x.id === qid)
    setDraft(q ? JSON.parse(JSON.stringify(q)) : null)
    setEditingId(qid)
  }

  function handleSaveQuestion(updated) {
    setQuiz((prev) => {
      const exists = prev.questions.find((q) => q.id === updated.id)
      let newQuestions
      if (exists) {
        newQuestions = prev.questions.map((q) => (q.id === updated.id ? updated : q))
      } else {
        newQuestions = [...prev.questions, updated]
      }
      return { ...prev, questions: newQuestions }
    })
    setDraft(null)
    setEditingId(null)
  }

  function deleteQuestion(qid) {
    if (!window.confirm('Delete this question?')) return
    setQuiz((q) => ({ ...q, questions: q.questions.filter((x) => x.id !== qid) }))
    if (editingId === qid) {
      setEditingId(null)
      setDraft(null)
    }
  }

  function handleSave() {
    setSaving(true)
    // TODO: send quiz to backend
    setTimeout(() => {
      setSaving(false)
      alert('Quiz saved (placeholder)')
    }, 700)
  }

  function handleCancel() {
    navigate('/admin/quizzes')
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
      <div className="max-w-6xl mx-auto">
        <QuizHeader title={quiz.title} type={quiz.type} onChangeTitle={changeTitle} onSave={handleSave} onCancel={handleCancel} saving={saving} />

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
            <QuestionEditor question={draft} onSave={handleSaveQuestion} onClose={() => { setDraft(null); setEditingId(null) }} />
          </div>
        </div>
      </div>
    </div>
  )
}