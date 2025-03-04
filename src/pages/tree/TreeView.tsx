import { useState } from "react";
import styles from "./styles.module.css";

type TreeNode = {
  id: number;
  code: string | null;
  name: string;
  parentId: number;
  children?: TreeNode[];
};

type TreeProps = {
  data: TreeNode[];
  fetchChildren: (key: string, id: number) => Promise<TreeNode[]>;
  level?: number;
};

export default function TreeView({
  data,
  fetchChildren,
  level = 0,
}: TreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<{
    [key: number]: TreeNode[];
  }>({});

  const toggleNode = async (node: TreeNode) => {
    if (expandedNodes[node.id]) {
      setExpandedNodes((prev) => {
        const newState = { ...prev };
        delete newState[node.id];
        return newState;
      });
    } else {
      if (!node.children || node.children.length === 0) {
        if (node.code) {
          try {
            let children: TreeNode[] = [];
            children = await fetchChildren(node.code, node.id);
            setExpandedNodes((prev) => ({ ...prev, [node.id]: children }));
          } catch (error) {
            console.error("Error fetching children:", error);
          }
        }
      } else {
        setExpandedNodes((prev) => ({
          ...prev,
          [node.id]: node.children || [],
        }));
      }
    }
  };

  const renderTree = (nodes: TreeNode[], currentLevel: number) => {
    return (
      <ul className={styles.listWrapper}>
        {nodes.map((node) => (
          <li key={node.id}>
            <button
              onClick={() => {
                if (node.children?.length != 0) {
                  toggleNode(node);
                }
              }}
            >
              {expandedNodes[node.id] ? "▼" : "▶"} {node.code}. {node.name}
            </button>
            {expandedNodes[node.id] && expandedNodes[node.id].length > 0 && (
              <div>{renderTree(expandedNodes[node.id], currentLevel + 1)}</div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>{data.length > 0 ? renderTree(data, level) : <p>Loading...</p>}</div>
  );
}
