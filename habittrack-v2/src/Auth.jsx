import { useState } from 'react';
import { login, register } from './services/authApi';

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
    <div style={{ padding: '20px' }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ display: 'block', margin: '10px 0', padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', margin: '10px 0', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', margin: '10px 0' }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      
      <button onClick={() => setIsLogin(!isLogin)} style={{ padding: '8px 16px' }}>
        Switch to {isLogin ? 'Register' : 'Login'}
      </button>
      
      {message && <p style={{ marginTop: '20px', color: message.includes('Success') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
}

export default Auth;