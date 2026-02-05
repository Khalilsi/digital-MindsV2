import logo from './logo.svg';
import './App.css';
import './components/CrButton'
import CrButton from './components/CrButton';
import Navbar from './components/navbar';
import Login from './pages/login';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-10">
      <Login />
    </div>
  );
}

export default App;
