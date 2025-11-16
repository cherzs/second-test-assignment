import { useState, useCallback, useEffect, useRef } from 'react';
import { buildTree } from '../utils/buildTree';
import CalcNodeItem from './CalcNodeItem';
import './CalcTree.css';

function CalcTree({ nodes, onUpdate, user }) {
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());
  const prevUserRef = useRef(user);

  useEffect(() => {
    const prevUser = prevUserRef.current;
    if (prevUser !== null && user === null) {
      const tree = buildTree(nodes);
      const allRootIds = new Set(tree.map(node => node.id));
      setCollapsedNodes(allRootIds);
    }
    prevUserRef.current = user;
  }, [user, nodes]);

  const toggleExpand = useCallback((nodeId) => {
    setCollapsedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const tree = buildTree(nodes);

  if (tree.length === 0) {
    return (
      <div className="calc-tree">
        <div className="empty-state">
          <p>No calculations yet. {user ? 'Create a root number to get started.' : 'Login to create calculations.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="calc-tree">
      <div className="tree-container">
        {tree.map(node => (
          <CalcNodeItem
            key={node.id}
            node={node}
            onUpdate={onUpdate}
            user={user}
            level={0}
            isExpanded={!collapsedNodes.has(node.id)}
            onToggleExpand={() => toggleExpand(node.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default CalcTree;
