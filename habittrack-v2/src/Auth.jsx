import { useState } from 'react';
import { login, register } from './services/authApi';
import './styles/Auth.css'
function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
        
    try {
      const data = isLogin
            ? await login(username, password)
            : await register(username, password);

      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';  // Add this line
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background-text-wrapper">
        <div className="auth-background-text auth-bg-text-1">
          It takes 21 days to form a habit and 90 days for that habit to become a lifestyle.
        </div>
        <div className="auth-background-text auth-bg-text-2">
          It takes 21 days to form a habit and 90 days for that habit to become a lifestyle.
        </div>
        <div className="auth-background-text auth-bg-text-3">
          It takes 21 days to form a habit and 90 days for that habit to become a lifestyle.
        </div>
        <div className="auth-background-text auth-bg-text-4">
          It takes 21 days to form a habit and 90 days for that habit to become a lifestyle.
        </div>
      </div>
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-brand">HabitTrack</h1>
          <h2 className="auth-title">{isLogin ? 'Welcome Back!' : 'Get Started'}</h2>
          <p className="auth-subtitle">
            {isLogin ? 'Sign in to continue your journey' : 'Create an account to begin!'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="auth-input"
              required
            />
          </div>
          
          <div className="auth-input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
          </div>
          
          <button type="submit" className="auth-button">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        
        <button 
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage('');
          }} 
          className="auth-switch-button"
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
        
        {message && (
          <p className={`auth-message ${message.includes('Success') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Auth;