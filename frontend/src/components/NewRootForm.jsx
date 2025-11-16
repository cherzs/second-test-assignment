import { useState } from 'react';
import { createRoot } from '../api/calcs';
import './NewRootForm.css';

function NewRootForm({ onSuccess }) {
  const [startingNumber, setStartingNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const num = parseFloat(startingNumber);
      if (isNaN(num)) {
        throw new Error('Please enter a valid number');
      }

      await createRoot(num);
      setStartingNumber('');
      onSuccess && onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create root');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-root-form">
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          step="any"
          value={startingNumber}
          onChange={(e) => setStartingNumber(e.target.value)}
          placeholder="Starting number"
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          Create Root
        </button>
      </form>
      {loading && <div className="loading-indicator">...loading</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default NewRootForm;
