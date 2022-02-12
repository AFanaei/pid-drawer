import { useState } from "react";
import { Edit, Edit2, Edit3 } from "react-feather";
import DrawPane from "./DrawPane";

import styles from "./Drawer.module.css";

function Drawer({ pos, image }) {
  const [selectedTool, setSelectedTool] = useState("");
  const [activeShape, setActiveShape] = useState({
    points: [],
    currentPoint: undefined,
    color: "#000",
  });
  const [data, setData] = useState({
    lines: [
      {
        points: [
          [10, 10],
          [20, 20],
          [20, 40],
        ],
        color: "#800",
      },
      {
        points: [
          [100, 100],
          [200, 200],
        ],
        color: "#080",
      },
    ],
  });
  const tools = [
    { name: "line", icon: <Edit /> },
    { name: "line2", icon: <Edit2 /> },
    { name: "line3", icon: <Edit3 /> },
  ];
  const onCurrentPointDraw = (x, y) => {
    if (selectedTool === "line") {
      if (activeShape.points.length === 0) {
        return;
      }
      const newData = { ...activeShape };
      const [oldX, oldY] = newData.points[newData.points.length - 1];
      const dx = Math.abs(x - oldX);
      const dy = Math.abs(y - oldY);
      const [newX, newY] = dx > dy ? [x, oldY] : [oldX, y];
      newData.currentPoint = [newX, newY];
      setActiveShape(newData);
    }
  };
  const onPointDraw = (x, y, shouldFinish = false) => {
    if (selectedTool === "line") {
      const newData = { ...activeShape };
      let [newX, newY] = [x, y];
      if (newData.points.length) {
        const [oldX, oldY] = newData.points[newData.points.length - 1];
        const dx = Math.abs(x - oldX);
        const dy = Math.abs(y - oldY);
        [newX, newY] = dx > dy ? [x, oldY] : [oldX, y];
      }
      newData.points.push([newX, newY]);
      setActiveShape(newData);
    }

    if (shouldFinish) {
      if (selectedTool === "line") {
        const newData = { ...data };
        newData.lines.push({
          points: activeShape.points,
          color: activeShape.color,
        });
        setData(newData);
      }
      setActiveShape({ points: [], color: "#000" });
    }
  };
  return (
    <div>
      <div className="window" style={{ width: "74px" }}>
        <div className="title-bar">
          <div className="title-bar-text">ToolBox</div>
        </div>
        <div className={`${styles["tool-container"]}`}>
          {tools.map((tool) => (
            <button
              className={`${styles.tool} ${
                tool.name === selectedTool ? styles.active : null
              }`}
              key={tool.name}
              onClick={() => setSelectedTool(tool.name)}
            >
              {tool.icon}
            </button>
          ))}
        </div>
      </div>
      <DrawPane
        pos={pos}
        image={image}
        data={data}
        selectedTool={selectedTool}
        handleDraw={onPointDraw}
        handleDrawCurrent={onCurrentPointDraw}
        activeShape={activeShape}
      />
    </div>
  );
}
export default Drawer;
