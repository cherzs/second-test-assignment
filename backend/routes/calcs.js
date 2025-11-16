import express from 'express';
import { calcNodes } from '../store/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(calcNodes);
});

router.post('/root', authenticateToken, (req, res) => {
  try {
    const { startingNumber } = req.body;

    if (typeof startingNumber !== 'number') {
      return res.status(400).json({ error: 'startingNumber must be a number' });
    }

    const newNode = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      parentId: null,
      createdBy: req.user.userId,
      createdAt: new Date().toISOString(),
      operationType: null,
      rightOperand: null,
      result: startingNumber
    };

    calcNodes.push(newNode);
    res.status(201).json(newNode);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create root node' });
  }
});

router.post('/:parentId/reply', authenticateToken, (req, res) => {
  try {
    const { parentId } = req.params;
    const { operationType, rightOperand } = req.body;

    if (!['add', 'sub', 'mul', 'div'].includes(operationType)) {
      return res.status(400).json({ error: 'Invalid operationType. Must be: add, sub, mul, div' });
    }

    if (typeof rightOperand !== 'number') {
      return res.status(400).json({ error: 'rightOperand must be a number' });
    }

    const parentNode = calcNodes.find(n => n.id === parentId);
    if (!parentNode) {
      return res.status(404).json({ error: 'Parent node not found' });
    }

    let result;
    switch (operationType) {
      case 'add':
        result = parentNode.result + rightOperand;
        break;
      case 'sub':
        result = parentNode.result - rightOperand;
        break;
      case 'mul':
        result = parentNode.result * rightOperand;
        break;
      case 'div':
        if (rightOperand === 0) {
          return res.status(400).json({ error: 'Division by zero is not allowed' });
        }
        result = parentNode.result / rightOperand;
        break;
      default:
        return res.status(400).json({ error: 'Invalid operation' });
    }

    const newNode = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      parentId: parentId,
      createdBy: req.user.userId,
      createdAt: new Date().toISOString(),
      operationType,
      rightOperand,
      result
    };

    calcNodes.push(newNode);
    res.status(201).json(newNode);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reply node' });
  }
});

router.delete('/:nodeId', authenticateToken, (req, res) => {
  try {
    const { nodeId } = req.params;
    const nodeIndex = calcNodes.findIndex(n => n.id === nodeId);

    if (nodeIndex === -1) {
      return res.status(404).json({ error: 'Node not found' });
    }

    const node = calcNodes[nodeIndex];

    // Only allow deletion if user is the creator
    if (node.createdBy !== req.user.userId) {
      return res.status(403).json({ error: 'You can only delete your own nodes' });
    }

    // Recursively delete all children
    const deleteNodeAndChildren = (id) => {
      const children = calcNodes.filter(n => n.parentId === id);
      children.forEach(child => {
        deleteNodeAndChildren(child.id);
      });
      const index = calcNodes.findIndex(n => n.id === id);
      if (index !== -1) {
        calcNodes.splice(index, 1);
      }
    };

    deleteNodeAndChildren(nodeId);

    res.status(200).json({ message: 'Node deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete node' });
  }
});

export default router;

