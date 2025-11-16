import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { register, login } from '../api/auth';
import './AuthPanel.css';

function AuthPanel({ onAuthChange }) {
  const { user, login: setAuth, logout } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await login(username, password);
      } else {
        response = await register(username, password);
      }

      setAuth(response.token, {
        id: response.userId,
        username: response.username
      });

      setUsername('');
      setPassword('');
      onAuthChange && onAuthChange();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="auth-panel">
        <div className="auth-status">
          <span>Logged in as: <strong>{user.username}</strong></span>
          <button onClick={() => { logout(); onAuthChange && onAuthChange(); }} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-panel">
      <div className="auth-tabs">
        <button
          className={isLogin ? 'active' : ''}
          onClick={() => { setIsLogin(true); setError(''); }}
        >
          Login
        </button>
        <button
          className={!isLogin ? 'active' : ''}
          onClick={() => { setIsLogin(false); setError(''); }}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            minLength={3}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>
    </div>
  );
}

export default AuthPanel;

