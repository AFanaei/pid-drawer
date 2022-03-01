import { useEffect, useRef, useState } from "react";
import raphael from "raphael";

const rectStyles = {
  link: { fill: "#008080", stroke: "#ffffff", "stroke-width": 2 },
  equipment: { fill: "#000", stroke: "#000", "stroke-width": 2 },
  default: {
    fill: "#3f3f3f",
    "fill-opacity": 0.3,
    stroke: "#32cd32",
    "stroke-width": 2,
  },
};
function DrawPane({
  pos,
  image,
  data,
  selectedTool,
  handleDraw,
  handleDrawEnd,
  handleDrawCurrent,
  activeShape,
  handleKeyDown,
  showBackground,
}) {
  const [mousePos, setPos] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const canvas = useRef(null);
  const paper = useRef(null);
  const over = useRef(null);
  let paperR = useRef(null);
  let activeDrawing = useRef(null);

  useEffect(() => {
    const ctx = canvas.current.getContext("2d");
    ctx.drawImage(image, 0, 0);
  }, [image]);

  useEffect(() => {
    paperR.current = raphael(paper.current);
    data.lines.forEach((line) => {
      paperR.current
        .path(
          line.points
            .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x},${y}`)
            .join("")
        )
        .attr({
          stroke: line.selected ? "#f00" : line.color,
          "stroke-dasharray":
            line.style === "dash" && !line.selected ? "-" : "",
          "stroke-width": line.selected ? 4 : 3,
          "arrow-end": "classic-wide-long",
        });
    });

    data.rects.forEach((rect) => {
      const pos = [
        rect.points[0][0] < rect.points[1][0]
          ? rect.points[0][0]
          : rect.points[1][0],
        rect.points[0][1] < rect.points[1][1]
          ? rect.points[0][1]
          : rect.points[1][1],
        Math.abs(rect.points[1][0] - rect.points[0][0]),
        Math.abs(rect.points[1][1] - rect.points[0][1]),
      ];
      paperR.current.rect(...pos).attr(
        rect.selected
          ? {
              stroke: "#f00",
              fill: "#f00",
              "fill-opacity": 0.5,
              "stroke-width": 3,
            }
          : rectStyles[rect.content] || rectStyles.default
      );
    });
  }, [data]);

  useEffect(() => {
    if (activeDrawing.current) activeDrawing.current.remove();
    if (!activeShape) return;

    if (activeShape.type === "line") {
      if (activeShape.currentPoint)
        setPos({
          x: activeShape.currentPoint[0],
          y: activeShape.currentPoint[1],
          w: 0,
          h: 0,
        });
      activeDrawing.current = paperR.current
        .path(
          (activeShape.currentPoint
            ? [...activeShape.points, activeShape.currentPoint]
            : activeShape.points
          )
            .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x},${y}`)
            .join("")
        )
        .attr({
          stroke: activeShape.color,
          "stroke-width": 3,
          "arrow-end": "classic-wide-long",
        });
    } else if (activeShape.type === "rect") {
      if (!activeShape.currentPoint) return;
      const pos = [
        activeShape.points[0][0] < activeShape.currentPoint[0]
          ? activeShape.points[0][0]
          : activeShape.currentPoint[0],
        activeShape.points[0][1] < activeShape.currentPoint[1]
          ? activeShape.points[0][1]
          : activeShape.currentPoint[1],
        Math.abs(activeShape.currentPoint[0] - activeShape.points[0][0]),
        Math.abs(activeShape.currentPoint[1] - activeShape.points[0][1]),
      ];
      setPos({
        x: activeShape.currentPoint[0],
        y: activeShape.currentPoint[1],
        w: pos[2],
        h: pos[3],
      });
      activeDrawing.current = paperR.current.rect(...pos).attr({
        "stroke-width": 2,
      });
    }
  }, [activeShape]);

  return (
    <>
      <div
        ref={over}
        style={{
          position: "fixed",
          top: pos.y,
          left: pos.x,
          width: pos.w,
          height: pos.h,
          zIndex: 1,
          display: selectedTool === "" ? "none" : "block",
        }}
        tabIndex="0"
        onClick={(e) => {
          handleDraw(e.pageX - pos.x, e.pageY - pos.y);
        }}
        onDoubleClick={(e) => {
          handleDrawEnd(e.pageX - pos.x, e.pageY - pos.y);
        }}
        onMouseMove={(e) => {
          if (selectedTool) {
            handleDrawCurrent(e.pageX - pos.x, e.pageY - pos.y);
            if (!activeShape?.currentPoint) {
              setPos({
                x: e.pageX - pos.x,
                y: e.pageY - pos.y,
                w: 0,
                h: 0,
              });
            }
          }
        }}
        onKeyDown={(e) => {
          handleKeyDown(e.key);
        }}
      ></div>
      <div
        ref={paper}
        style={{
          position: "fixed",
          top: pos.y,
          left: pos.x,
          width: pos.w,
          height: pos.h,
          zIndex: -1,
        }}
      ></div>
      <canvas
        ref={canvas}
        style={{
          position: "fixed",
          top: pos.y,
          left: pos.x,
          zIndex: -2,
          visibility: showBackground ? "visible" : "hidden",
        }}
        width={pos.w}
        height={pos.h}
      ></canvas>
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 100,
          height: 50,
          zIndex: -2,
        }}
      >
        {Object.keys(mousePos)
          .filter((key) => mousePos[key])
          .map((key) => (
            <div key={key}>
              {key}: {mousePos[key]}
            </div>
          ))}
      </div>
      <div
        style={{
          position: "fixed",
          display: showBackground ? "none" : "block",
          top: pos.y,
          left: pos.x,
          width: pos.w,
          height: pos.h,
          zIndex: -2,
          backgroundColor: "#404040",
        }}
      ></div>
    </>
  );
}
export default DrawPane;
