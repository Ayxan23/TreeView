import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";

interface Data {
  id: number;
  name: string;
  code: string;
}

const Home: React.FC = () => {
  const [data, setData] = useState<Data[]>([]);
  const [child, setChild] = useState<Data[]>([]);

  const [visibleItems, setVisibleItems] = useState([true]);

  const toggleVisibility = (index: number) => {
    setVisibleItems(new Array(data.length).fill(true));
    setVisibleItems((prev) =>
      prev.map((item, i) => (i === index ? !item : item))
    );
  };

  const API_URL = "/api/v1/goods";

  const extraFetch = (url: string, i: number) => {
    console.log(url);
    axios
      .get(`${API_URL}${url}`)
      .then((response) => setChild(response.data.data))
      .then(() => toggleVisibility(i))
      .catch((error) => console.error("Error fetching data", error));
  };

  useEffect(() => {
    axios
      .get(`${API_URL}?pageNumber=1&pageSize=15`)
      .then((res) => setData(res.data.data))
      .catch((error) => console.error("Error fetching data", error));
  }, []);

  return (
    <div className="container">
      <div className={styles.wrapper}>
        {data.map((item, i) => (
          <div className={styles.card} key={i}>
            <div
              onClick={() => {
                extraFetch(`?key=${item.code}&id=${item.id}`, i);
              }}
            >
              {item.code}. {item.name}
            </div>
            <div
              className={styles.childData}
              style={{
                display: visibleItems[i] ? "none" : "block",
                cursor: "pointer",
              }}
            >
              {child.map((ch, i) => (
                <div key={i}>
                  {ch.code}. {ch.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
