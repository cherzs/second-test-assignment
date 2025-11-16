import './DeleteConfirmModal.css';

function DeleteConfirmModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Delete Root Number</h3>
        <p className="modal-message">
          Are you sure you want to delete this root number and all its replies?
        </p>
        <div className="modal-actions">
          <button onClick={onCancel} className="modal-btn modal-btn-cancel">
            Cancel
          </button>
          <button onClick={onConfirm} className="modal-btn modal-btn-confirm">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;

