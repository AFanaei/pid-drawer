import { useState, useMemo } from "react";

const ColorOptions = [
  { name: "black", value: "#000" },
  { name: "yellow", value: "#fefd09" },
  { name: "white", value: "#e2e2e2" },
  { name: "blue", value: "#4a7fac" },
  { name: "red", value: "#780204" },
];
const useLine = ({ data, setData }) => {
  const [activeShape, setActiveShape] = useState({
    type: "line",
    points: [],
    currentPoint: undefined,
    color: "#000",
    style: "solid",
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
        type: "line",
        style: "solid",
      });
      setData(newData);
      setActiveShape({
        points: [],
        color: "#000",
        type: "line",
        style: "solid",
      });
    }
  };

  return {
    activeShape,
    options: [
      {
        name: "color",
        type: "select",
        options: ColorOptions,
        value: data.lines.filter((p) => p.selected)[0]?.color,
        onChange: (value) => {
          const newData = { ...data };
          newData.lines.forEach((p) => {
            if (p.selected) {
              p.color = value;
            }
          });
          setData(newData);
        },
      },
      {
        name: "style",
        type: "select",
        options: [
          { name: "solid", value: "solid" },
          { name: "dash", value: "dash" },
        ],
        value: data.lines.filter((p) => p.selected)[0]?.style,
        onChange: (value) => {
          const newData = { ...data };
          newData.lines.forEach((p) => {
            if (p.selected) {
              p.style = value;
            }
          });
          setData(newData);
        },
      },
    ],
    handleClick: (x, y) => {
      onPointDraw(x, y, false);
    },
    handleDoubleClick: (x, y) => {
      onPointDraw(x, y, true);
    },
    handleMouseMove: (x, y) => {
      onCurrentPointDraw(x, y);
    },
    handleKeyDown: () => {},
  };
};

const useRect = ({ data, setData }) => {
  const [activeShape, setActiveShape] = useState({
    type: "rect",
    points: [],
    currentPoint: undefined,
    content: undefined,
  });
  const onCurrentPointDraw = (x, y) => {
    if (activeShape.points.length === 0) {
      return;
    }
    const newData = { ...activeShape };
    newData.currentPoint = [x, y];
    setActiveShape(newData);
  };
  const onPointDraw = (x, y) => {
    const newData = { ...activeShape };
    newData.points.push([x, y]);
    setActiveShape(newData);

    if (newData.points.length === 2) {
      const newData = { ...data };
      newData.rects.push({
        points: activeShape.points,
        type: "rect",
        content: undefined,
      });
      setData(newData);
      setActiveShape({
        type: "rect",
        points: [],
        currentPoint: undefined,
        content: undefined,
      });
    }
  };

  const handleOptChange = (opt) => {
    return (value) => {
      const newData = { ...data };
      newData.rects.forEach((p) => {
        if (p.selected) {
          p[opt] = value;
        }
      });
      setData(newData);
    };
  };
  return {
    activeShape,
    options: [
      {
        name: "content",
        type: "select",
        options: [
          { name: "---", value: undefined },
          { name: "link", value: "link" },
          { name: "indicator", value: "indicator" },
          { name: "valve", value: "valve" },
          { name: "equipment", value: "equipment" },
          { name: "slider", value: "slider" },
          { name: "alarm", value: "alarm" },
        ],
        value: data.rects.filter((p) => p.selected)[0]?.content,
        onChange: handleOptChange("content"),
      },
      {
        validFor: ["valve", "indicator"],
        name: "hideLogic",
        type: "checkbox",
        value: data.rects.filter((p) => p.selected)[0]?.hideLogic,
        onChange: handleOptChange("hideLogic"),
      },
      {
        validFor: ["valve"],
        name: "rotated",
        type: "checkbox",
        value: data.rects.filter((p) => p.selected)[0]?.rotated,
        onChange: handleOptChange("rotated"),
      },
      {
        validFor: [
          "valve",
          "indicator",
          "slider",
          "alarm",
          "equipment",
          "link",
        ],
        name: "id",
        type: "input",
        value: data.rects.filter((p) => p.selected)[0]?.id,
        onChange: handleOptChange("id"),
      },
      {
        validFor: ["valve", "indicator", "slider", "alarm"],
        name: "variableId",
        type: "input",
        value: data.rects.filter((p) => p.selected)[0]?.variableId,
        onChange: handleOptChange("variableId"),
      },
      {
        validFor: ["valve", "indicator", "link"],
        name: "linkTo",
        type: "input",
        value: data.rects.filter((p) => p.selected)[0]?.linkTo,
        onChange: handleOptChange("linkTo"),
      },
      {
        validFor: ["valve", "indicator", "alarm"],
        name: "variant",
        type: "input",
        value: data.rects.filter((p) => p.selected)[0]?.variant,
        onChange: handleOptChange("variant"),
      },
      {
        validFor: ["valve", "indicator"],
        name: "name",
        type: "input",
        value: data.rects.filter((p) => p.selected)[0]?.name,
        onChange: handleOptChange("name"),
      },
      {
        validFor: ["equipment"],
        name: "image",
        type: "input",
        value: data.rects.filter((p) => p.selected)[0]?.image,
        onChange: handleOptChange("image"),
      },
      {
        validFor: ["slider"],
        name: "color",
        type: "select",
        options: ColorOptions,
        value: data.rects.filter((p) => p.selected)[0]?.color,
        onChange: handleOptChange("color"),
      },
    ],
    handleClick: (x, y) => {
      onPointDraw(x, y, false);
    },
    handleDoubleClick: (x, y) => {},
    handleMouseMove: (x, y) => {
      onCurrentPointDraw(x, y);
    },
    handleKeyDown: () => {},
  };
};

const useHand = ({ data, setData }) => {
  const [activeShape, setActiveShape] = useState(undefined);
  const delta = 5;
  const boxes = useMemo(() => {
    const lineBoxes = data.lines.reduce((a, b, curIndex) => {
      b.points.forEach(([x, y], index) => {
        if (index === 0) return;

        const [lastX, lastY] = b.points[index - 1];
        if (x === lastX) {
          a.push({
            topLeft: [x - delta, lastY < y ? lastY : y],
            botRight: [x + delta, lastY < y ? y : lastY],
            index: curIndex,
            shape: "lines",
          });
        } else if (y === lastY) {
          a.push({
            topLeft: [lastX < x ? lastX : x, y - delta],
            botRight: [lastX < x ? x : lastX, y + delta],
            index: curIndex,
            shape: "lines",
          });
        } else {
          throw new Error("not supported");
        }
      });
      return a;
    }, []);
    const rectBoxes = data.rects.reduce((a, b, curIndex) => {
      const topLeft = [
        b.points[0][0] < b.points[1][0] ? b.points[0][0] : b.points[1][0],
        b.points[0][1] < b.points[1][1] ? b.points[0][1] : b.points[1][1],
      ];
      const botRight = [
        b.points[0][0] > b.points[1][0] ? b.points[0][0] : b.points[1][0],
        b.points[0][1] > b.points[1][1] ? b.points[0][1] : b.points[1][1],
      ];
      a.push({
        topLeft: [topLeft[0] - delta, topLeft[1] - delta],
        botRight: [botRight[0] + delta, topLeft[1] + delta],
        index: curIndex,
        shape: "rects",
      });
      a.push({
        topLeft: [botRight[0] - delta, topLeft[1] - delta],
        botRight: [botRight[0] + delta, botRight[1] + delta],
        index: curIndex,
        shape: "rects",
      });
      a.push({
        topLeft: [topLeft[0] - delta, botRight[1] - delta],
        botRight: [botRight[0] + delta, botRight[1] + delta],
        index: curIndex,
        shape: "rects",
      });
      a.push({
        topLeft: [topLeft[0] - delta, topLeft[1] - delta],
        botRight: [topLeft[0] + delta, botRight[1] + delta],
        index: curIndex,
        shape: "rects",
      });
      return a;
    }, []);
    const res = lineBoxes.concat(rectBoxes);
    return res;
  }, [data]);
  return {
    activeShape,
    handleClick: (x, y) => {
      const newData = { ...data };
      if (activeShape) {
        setActiveShape(undefined);
      }

      newData.lines.forEach((p) => {
        p.selected = false;
      });
      newData.rects.forEach((p) => {
        p.selected = false;
      });

      boxes.forEach((box) => {
        if (
          x >= box.topLeft[0] &&
          x <= box.botRight[0] &&
          y >= box.topLeft[1] &&
          y <= box.botRight[1]
        ) {
          newData[box.shape][box.index].selected = true;
          setActiveShape(newData[box.shape][box.index]);
        }
      });

      setData(newData);
    },
    handleDoubleClick: (x, y) => {},
    handleMouseMove: (x, y) => {},
    handleKeyDown: (key) => {
      if (key === "Delete") {
        const newData = { ...data };
        newData.lines = newData.lines.filter((p) => {
          return !p.selected;
        });
        newData.rects = newData.rects.filter((p) => {
          return !p.selected;
        });
        setActiveShape(undefined);
        setData(newData);
      }
    },
  };
};

const exportList = { useLine, useHand, useRect };
export default exportList;
export { useLine, useHand, useRect };
