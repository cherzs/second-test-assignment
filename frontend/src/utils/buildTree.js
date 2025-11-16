export function buildTree(nodes) {
  if (!nodes || nodes.length === 0) {
    return [];
  }

  const nodeMap = new Map();
  const rootNodes = [];

  nodes.forEach(node => {
    nodeMap.set(node.id, { ...node, children: [] });
  });

  nodes.forEach(node => {
    const nodeWithChildren = nodeMap.get(node.id);
    if (node.parentId === null) {
      rootNodes.push(nodeWithChildren);
    } else {
      const parent = nodeMap.get(node.parentId);
      if (parent) {
        parent.children.push(nodeWithChildren);
      } else {
        rootNodes.push(nodeWithChildren);
      }
    }
  });

  return rootNodes;
}

