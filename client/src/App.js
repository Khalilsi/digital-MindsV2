import './App.css';
import './components/CrButton'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar';
import Login from './pages/login';
import AdminPage from './pages/adminMainPage';
import QuizEditor from './pages/QuizEditor';

function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin/quizzes" element={<AdminPage />} />
      <Route path="/admin/quizzes/:id/edit" element={<QuizEditor />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
