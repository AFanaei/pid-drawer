import { useState } from "react";
import { Edit, MousePointer } from "react-feather";
import { useLine } from "./Tools";
import DrawPane from "./DrawPane";

import styles from "./Drawer.module.css";

function Drawer({ pos, image }) {
  const [selectedTool, setSelectedTool] = useState("");
  const [data, setData] = useState({ lines: [] });
  const lineDrawer = useLine({ data, setData });
  const tools = {
    line: {
      icon: <Edit />,
      activeShape: lineDrawer.activeShape,
      handleClick: lineDrawer.handleClick,
      handleDoubleClick: lineDrawer.handleDoubleClick,
      handleMouseMove: lineDrawer.handleMouseMove,
    },
    select: { name: "hand", icon: <MousePointer /> },
  };
  return (
    <div>
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
        handleDrawCurrent={
          selectedTool !== "" ? tools[selectedTool].handleMouseMove : undefined
        }
        activeShape={
          selectedTool !== "" ? tools[selectedTool].activeShape : undefined
        }
      />
    </div>
  );
}
export default Drawer;
