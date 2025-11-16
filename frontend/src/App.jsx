import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header';
import CalcTree from './components/CalcTree';
import NewRootForm from './components/NewRootForm';
import { fetchCalcs } from './api/calcs';
import './App.css';

function App() {
  const { user } = useAuth();
  const [calcs, setCalcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCalcs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCalcs();
      setCalcs(data);
    } catch (err) {
      setError(err.message || 'Failed to load calculations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalcs();
  }, []);

  return (
    <div className="app">
      <Header />
      
      <div className="app-content">
        {user && (
          <div style={{ marginBottom: '32px' }}>
            <NewRootForm onSuccess={loadCalcs} />
          </div>
        )}

        {loading ? (
          <div className="loading">...loading</div>
        ) : error ? (
          <div className="error">Error: {error}</div>
        ) : (
          <CalcTree nodes={calcs} onUpdate={loadCalcs} user={user} />
        )}
      </div>
    </div>
  );
}

export default App;
