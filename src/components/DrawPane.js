import { useEffect, useRef } from "react";
import raphael from "raphael";

function DrawPane({
  pos,
  image,
  data,
  selectedTool,
  handleDraw,
  handleDrawEnd,
  handleDrawCurrent,
  activeShape,
}) {
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
          stroke: line.color,
          "stroke-width": 2,
          "arrow-end": "classic-wide-long",
        });
    });
  }, [data]);

  useEffect(() => {
    if (activeDrawing.current) activeDrawing.current.remove();
    if (!activeShape) return;

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
        "stroke-width": 2,
        "arrow-end": "classic-wide-long",
      });
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
        onClick={(e) => {
          handleDraw(e.pageX - pos.x, e.pageY - pos.y);
        }}
        onDoubleClick={(e) => {
          handleDrawEnd(e.pageX - pos.x, e.pageY - pos.y);
        }}
        onMouseMove={(e) => {
          if (selectedTool) {
            handleDrawCurrent(e.pageX - pos.x, e.pageY - pos.y);
          }
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
        style={{ position: "fixed", top: pos.y, left: pos.x, zIndex: -2 }}
        width={pos.w}
        height={pos.h}
      ></canvas>
    </>
  );
}
export default DrawPane;
