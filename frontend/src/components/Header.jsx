import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { register, login } from '../api/auth';
import './Header.css';

function Header() {
  const { user, login: setAuth, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
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

      // Set auth state (works for both login and register)
      const userData = {
        id: response.userId,
        username: response.username
      };
      
      // Save token and user to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Reload page to refresh all state
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    // Reload page to refresh all state - simple and guaranteed to work
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Numeric Discussions</h1>
        
        <div className="header-auth">
          {user ? (
            <div className="header-user">
              <span className="header-username">{user.username}</span>
              <button onClick={handleLogout} className="header-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="header-auth-controls">
              <button
                onClick={() => setShowAuth(!showAuth)}
                className="header-btn"
              >
                {showAuth ? 'Cancel' : 'Login'}
              </button>
              {showAuth && (
                <div className="auth-dropdown">
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
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      minLength={3}
                    />
                    {error && <div className="auth-error">{error}</div>}
                    {loading && <div className="auth-loading">...loading</div>}
                    <button type="submit" disabled={loading} className="auth-submit">
                      {isLogin ? 'Login' : 'Register'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

