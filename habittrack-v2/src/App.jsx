import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './Auth';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div>
        <h1 style={{ padding: '20px' }}>HabitTrack V2</h1>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
