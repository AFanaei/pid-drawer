import { useState } from "react";
import { Edit, MousePointer, Edit3 } from "react-feather";
import { useHand, useLine, useRect } from "./Tools";
import DrawPane from "./DrawPane";
import LoadData from "./DataSelector";

import styles from "./Drawer.module.css";

function Drawer({ pos, image }) {
  const [selectedTool, setSelectedTool] = useState("");
  const [showBackground, setShowBackground] = useState(true);
  const [data, setData] = useState({ lines: [], rects: [] });
  const lineDrawer = useLine({ data, setData });
  const handDrawer = useHand({ data, setData });
  const RectDrawer = useRect({ data, setData });
  const tools = {
    line: {
      icon: <Edit3 />,
      options: lineDrawer.options,
      activeShape: lineDrawer.activeShape,
      handleClick: lineDrawer.handleClick,
      handleDoubleClick: lineDrawer.handleDoubleClick,
      handleMouseMove: lineDrawer.handleMouseMove,
      handleKeyDown: lineDrawer.handleKeyDown,
    },
    rect: {
      icon: <Edit />,
      options: RectDrawer.options,
      activeShape: RectDrawer.activeShape,
      handleClick: RectDrawer.handleClick,
      handleDoubleClick: RectDrawer.handleDoubleClick,
      handleMouseMove: RectDrawer.handleMouseMove,
      handleKeyDown: RectDrawer.handleKeyDown,
    },
    select: {
      icon: <MousePointer />,
      activeShape: handDrawer.activeShape,
      handleClick: handDrawer.handleClick,
      handleDoubleClick: handDrawer.handleDoubleClick,
      handleMouseMove: handDrawer.handleMouseMove,
      handleKeyDown: handDrawer.handleKeyDown,
    },
  };
  return (
    <div>
      <LoadData handleDataChange={setData} />
      <button
        variant="primary"
        onClick={() => {
          setShowBackground(!showBackground);
        }}
      >
        Toggle Back
      </button>
      <div className="window" style={{ width: "74px" }}>
        <div className="title-bar">
          <div className="title-bar-text">ToolBox</div>
        </div>
        <div className={`${styles["tool-container"]}`}>
          {Object.keys(tools).map((toolName) => (
            <button
              className={`${styles.tool} ${
                toolName === selectedTool ? styles.active : null
              }`}
              key={toolName}
              onClick={() => setSelectedTool(toolName)}
            >
              {tools[toolName].icon}
            </button>
          ))}
        </div>
      </div>
      {selectedTool &&
      selectedTool === "select" &&
      tools[selectedTool].activeShape &&
      tools[tools[selectedTool].activeShape.type].options ? (
        <div className="window" style={{ width: "113px" }}>
          <div className="title-bar">
            <div className="title-bar-text">Options</div>
          </div>
          <div className={`${styles["tool-container"]}`}>
            {tools[tools[selectedTool].activeShape.type].options
              .filter(
                (opt) =>
                  !opt.validFor ||
                  opt.validFor.indexOf(
                    tools[selectedTool].activeShape.content
                  ) !== -1
              )
              .map((opt) => {
                if (opt.type === "select") {
                  return (
                    <select
                      className={styles.option}
                      key={opt.name}
                      value={opt.value}
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        opt.onChange(e.target.value);
                      }}
                    >
                      {opt.options.map((option) => (
                        <option key={option.name} value={option.value}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  );
                } else if (opt.type === "checkbox") {
                  return (
                    <div className={styles.option} key={opt.name}>
                      <input
                        type="checkbox"
                        checked={opt.value}
                        id={opt.name}
                        onChange={(e) => {
                          opt.onChange(e.target.checked);
                        }}
                      />
                      <label htmlFor="example1">{opt.name}</label>
                    </div>
                  );
                } else if (opt.type === "input") {
                  return (
                    <div className={styles.option} key={opt.name}>
                      <label htmlFor={opt.name}>{opt.name}</label>
                      <input
                        id={opt.name}
                        type="text"
                        value={opt.value}
                        onChange={(e) => {
                          opt.onChange(e.target.value);
                        }}
                      />
                    </div>
                  );
                }
                return null;
              })}
          </div>
        </div>
      ) : null}
      <DrawPane
        showBackground={showBackground}
        pos={pos}
        image={image}
        data={data}
        selectedTool={selectedTool}
        handleDraw={
          selectedTool !== "" ? tools[selectedTool].handleClick : undefined
        }
        handleDrawEnd={
          selectedTool !== ""
            ? tools[selectedTool].handleDoubleClick
            : undefined
        }
        handleKeyDown={
          selectedTool !== "" ? tools[selectedTool].handleKeyDown : undefined
        }
        handleDrawCurrent={
          selectedTool !== "" ? tools[selectedTool].handleMouseMove : undefined
        }
        activeShape={
          selectedTool !== "" && selectedTool !== "select"
            ? tools[selectedTool].activeShape
            : undefined
        }
      />
    </div>
  );
}
export default Drawer;
