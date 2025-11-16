import { useState } from 'react';
import NewOperationForm from './NewOperationForm';
import DeleteConfirmModal from './DeleteConfirmModal';
import { deleteNode } from '../api/calcs';
import './CalcNodeItem.css';

function CalcNodeItem({ node, onUpdate, user, level = 0, isExpanded = true, onToggleExpand, isLastChild = false }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formatOperation = () => {
    if (!node.operationType) {
      return null;
    }

    const symbol = {
      add: '+',
      sub: '-',
      mul: '×',
      div: '÷'
    }[node.operationType] || node.operationType;

    return `${symbol} ${node.rightOperand}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const hasChildren = node.children && node.children.length > 0;
  const isRoot = level === 0;
  const canDelete = user && user.id === node.createdBy && isRoot;

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteNode(node.id);
      setShowDeleteModal(false);
      onUpdate && onUpdate();
    } catch (err) {
      alert(err.message || 'Failed to delete node');
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className={`calc-node-item ${isLastChild ? 'is-last' : ''}`}>
      <div className="node-content">
        <div className="node-header-row">
          <div className="node-result">
            <span className="result-value">{node.result}</span>
            {node.operationType && (
              <span className="operation-info">{formatOperation()}</span>
            )}
          </div>
          <div className="node-actions">
            {isRoot && hasChildren && (
              <button
                onClick={onToggleExpand}
                className={`expand-btn ${isExpanded ? 'expanded' : 'collapsed'}`}
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
              >
                <span className="chevron"></span>
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleDeleteClick}
                className="delete-btn"
                aria-label="Delete"
              >
                ×
              </button>
            )}
          </div>
        </div>
        
        <div className="node-meta">
          <span>{formatDate(node.createdAt)}</span>
        </div>

        {user && (
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="reply-btn"
          >
            {showReplyForm ? 'Cancel' : 'Reply'}
          </button>
        )}

        {showReplyForm && user && (
          <NewOperationForm
            parentId={node.id}
            onSuccess={() => {
              setShowReplyForm(false);
              onUpdate && onUpdate();
            }}
          />
        )}
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {hasChildren && isExpanded && (
        <div className="node-children">
          {node.children.map((child, index) => (
            <CalcNodeItem
              key={child.id}
              node={child}
              onUpdate={onUpdate}
              user={user}
              level={level + 1}
              isExpanded={true}
              isLastChild={index === node.children.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CalcNodeItem;
