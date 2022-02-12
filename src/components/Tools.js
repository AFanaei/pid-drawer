import { useState } from "react";

const useLine = ({ data, setData }) => {
  const [activeShape, setActiveShape] = useState({
    points: [],
    currentPoint: undefined,
    color: "#000",
  });
  const onCurrentPointDraw = (x, y) => {
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
  };
  const onPointDraw = (x, y, shouldFinish) => {
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

    if (shouldFinish) {
      const newData = { ...data };
      newData.lines.push({
        points: activeShape.points,
        color: activeShape.color,
      });
      setData(newData);
      setActiveShape({ points: [], color: "#000" });
    }
  };

  return {
    activeShape,
    handleClick: (x, y) => {
      onPointDraw(x, y, false);
    },
    handleDoubleClick: (x, y) => {
      onPointDraw(x, y, true);
    },
    handleMouseMove: (x, y) => {
      onCurrentPointDraw(x, y);
    },
  };
};

const exportList = { useLine };
export default exportList;
export { useLine };
