// ...existing code...
import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/logoHackathon.png'
import CrButton from './CrButton'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    try { localStorage.removeItem('auth') } catch {}
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cr-blue-dark border-cr-blue-dark text-white border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin/quizzes" aria-label="Home" className="flex items-center gap-3">
              {/* crown + logo to give a royal feel */}
              <img
                src={logo}
                alt="Hackathon"
                className="h-24 w-auto object-contain transform transition-transform hover:scale-105"
              />
            </Link>

            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/admin/quizzes"
                className={`px-3 py-2 rounded-md text-sm font-luckiest transition ${
                  location.pathname.startsWith('/admin/quizzes')
                    ? 'bg-yellow-400/10 text-yellow-300 ring-1 ring-yellow-300/20'
                    : 'text-white/90 hover:bg-white/6'
                }`}
              >
                Quizzes
              </Link>
              <Link
                to="/admin/users"
                className={`px-3 py-2 rounded-md text-sm font-luckiest transition ${
                  location.pathname.startsWith('/admin/users')
                    ? 'bg-yellow-400/10 text-yellow-300 ring-1 ring-yellow-300/20'
                    : 'text-white/90 hover:bg-white/6'
                }`}
              >
                Users
              </Link>
            </div>
          </div>

          <div className="flex items-start">
            <CrButton
              onClick={handleLogout}
              color="red"
              size="sm"
              aria-label="Logout"
            >
              Logout
            </CrButton>
          </div>
        </div>
      </div>
    </nav>
  )
}
