import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/navbar'
import Login from './pages/login'
import AdminPage from './pages/adminMainPage'
import UserDetail from './pages/UserDetail'
import UsersPage from './pages/UsersPage'
import QuizEditor from './pages/QuizEditor'

function AppRoutes() {
  const location = useLocation()
  const hideNavbar = location.pathname === '/' // login route

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div style={hideNavbar ? undefined : { paddingTop: '4rem' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin/quizzes" element={<AdminPage />} />
          <Route path="/admin/quizzes/:id/edit" element={<QuizEditor />} />
          <Route path="/admin/users/:id" element={<UserDetail />} />
          <Route path="/admin/users" element={<UsersPage />} />
        </Routes>
      </div>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
