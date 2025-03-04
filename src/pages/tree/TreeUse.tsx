import { useState, useEffect } from "react";
import TreeView from "./TreeView";
import axios from "axios";

type TreeNode = {
  id: number;
  code: string | null;
  name: string;
  parentId: number;
  children?: TreeNode[];
};

const fetchChildren = async (key: string, id: number) => {
  const response = await axios.get(`/api/v1/goods?key=${key}&id=${id}`);
  return response.data.data;
};

const fetchInitialData = async () => {
  const response = await axios.get("/api/v1/goods?pageNumber=1&pageSize=15");
  return response.data.data;
};

export default function TreeUse() {
  const [initialData, setInitialData] = useState<TreeNode[]>([]);

  useEffect(() => {
    fetchInitialData().then(setInitialData);
  }, []);

  return (
    <div className="container">
      <TreeView data={initialData} fetchChildren={fetchChildren} />
    </div>
  );
}
