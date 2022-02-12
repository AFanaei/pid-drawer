import { useState, useMemo } from "react";

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

const useHand = ({ data, setData }) => {
  const activeShape = undefined;
  const delta = 5;
  const boxes = useMemo(() => {
    return data.lines.reduce((a, b, curIndex) => {
      b.points.forEach(([x, y], index) => {
        if (index === 0) return;

        const [lastX, lastY] = b.points[index - 1];
        if (x === lastX) {
          a.push({
            topLeft: [x - delta, lastY < y ? lastY : y],
            botRight: [x + delta, lastY < y ? y : lastY],
            index: curIndex,
          });
        } else if (y === lastY) {
          a.push({
            topLeft: [lastX < x ? lastX : x, y - delta],
            botRight: [lastX < x ? x : lastX, y + delta],
            index: curIndex,
          });
        } else {
          throw new Error("not supported");
        }
      });
      return a;
    }, []);
  }, [data]);
  return {
    activeShape,
    handleClick: (x, y) => {
      const newData = { ...data };
      newData.lines.forEach((p) => {
        p.selected = false;
      });
      boxes.forEach((box) => {
        if (
          x >= box.topLeft[0] &&
          x <= box.botRight[0] &&
          y >= box.topLeft[1] &&
          y <= box.botRight[1]
        ) {
          newData.lines[box.index].selected = true;
        }
      });
      setData(newData);
    },
    handleDoubleClick: (x, y) => {},
    handleMouseMove: (x, y) => {},
  };
};

const exportList = { useLine, useHand };
export default exportList;
export { useLine, useHand };
