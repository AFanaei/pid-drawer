import { useState } from "react";
import { Edit, MousePointer } from "react-feather";
import { useHand, useLine } from "./Tools";
import DrawPane from "./DrawPane";
import LoadData from "./DataSelector";

import styles from "./Drawer.module.css";

function Drawer({ pos, image }) {
  const [selectedTool, setSelectedTool] = useState("");
  const [data, setData] = useState({ lines: [] });
  const lineDrawer = useLine({ data, setData });
  const handDrawer = useHand({ data, setData });
  const tools = {
    line: {
      icon: <Edit />,
      options: lineDrawer.options,
      activeShape: lineDrawer.activeShape,
      handleClick: lineDrawer.handleClick,
      handleDoubleClick: lineDrawer.handleDoubleClick,
      handleMouseMove: lineDrawer.handleMouseMove,
      handleKeyDown: lineDrawer.handleKeyDown,
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
        <div className="window" style={{ width: "74px" }}>
          <div className="title-bar">
            <div className="title-bar-text">Options</div>
          </div>
          <div className={`${styles["tool-container"]}`}>
            {tools[tools[selectedTool].activeShape.type].options.map((opt) => {
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
              }
            })}
          </div>
        </div>
      ) : null}
      <DrawPane
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
