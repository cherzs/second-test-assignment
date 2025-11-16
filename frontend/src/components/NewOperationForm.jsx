import { useState, useRef, useEffect } from 'react';
import { createReply } from '../api/calcs';
import './NewOperationForm.css';

function NewOperationForm({ parentId, onSuccess }) {
  const [operationType, setOperationType] = useState('add');
  const [rightOperand, setRightOperand] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const operations = [
    { value: 'add', label: '+' },
    { value: 'sub', label: '-' },
    { value: 'mul', label: '×' },
    { value: 'div', label: '÷' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleToggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(prev => !prev);
  };

  const handleOperationSelect = (value) => {
    setOperationType(value);
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const num = parseFloat(rightOperand);
      if (isNaN(num)) {
        throw new Error('Please enter a valid number');
      }

      await createReply(parentId, operationType, num);
      setRightOperand('');
      onSuccess && onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create reply');
    } finally {
      setLoading(false);
    }
  };

  const selectedOperation = operations.find(op => op.value === operationType);

  return (
    <div className="new-operation-form">
      <form onSubmit={handleSubmit}>
        <div className="dropdown-wrapper" ref={dropdownRef}>
          <button
            type="button"
            className="dropdown-trigger"
            onClick={handleToggleDropdown}
            disabled={loading}
          >
            <span className="dropdown-value">{selectedOperation?.label}</span>
            <span className="dropdown-arrow">▼</span>
          </button>
          {isDropdownOpen && (
            <div className="dropdown-panel">
              {operations.map(op => (
                <button
                  key={op.value}
                  type="button"
                  className={`dropdown-option ${operationType === op.value ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOperationSelect(op.value);
                  }}
                >
                  {op.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <input
          type="number"
          step="any"
          value={rightOperand}
          onChange={(e) => setRightOperand(e.target.value)}
          placeholder="Number"
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          Apply
        </button>
      </form>
      {loading && <div className="loading-indicator">...loading</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default NewOperationForm;
