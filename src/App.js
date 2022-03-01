import { useState } from "react";
import BackgroundSelector from "./components/BackgroundSelector";
import Drawer from "./components/Drawer";
import LoadData from "./components/DataSelector";
import { exportData, convertToPos } from "./Utils";

import "./App.css";

function App() {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const handleNewPage = (image, pos, id, parentId) => {
    setPages([
      ...pages,
      { pos, data: { lines: [], rects: [] }, image, id, parentId },
    ]);
    setCurrentPage(id);
  };
  const handleLoadData = (data) => {
    data.forEach((p) => {
      const img = new Image();
      img.src = p.image;
      img.onload = () => {
        setPages((pages) => [...pages, { ...p, image: img }]);
      };
    });
    setCurrentPage(data[0].id);
  };
  const handleSave = () => {
    exportData(
      "data.json",
      pages.map((p) => ({ ...p, image: p.image.src }))
    );
  };
  const handleExport = () => {
    const res = pages.map((p) => {
      const data = p.data;
      const modifiedData = {
        lines: data.lines.map((p) => ({
          points: p.points,
          color: p.color,
          style: p.style,
        })),
      };
      modifiedData.valves = data.rects
        .filter((p) => p.content === "valve")
        .map((p) => {
          const res = {
            id: p.id,
            pos: { ...convertToPos(p.points, p.variant || "valve") },
          };
          if (p.linkTo) res.linkTo = parseInt(p.linkTo);
          if (p.hideLogic) res.hideLogic = p.hideLogic;
          if (p.rotated) res.rotated = p.rotated;
          if (p.variant) res.type = p.variant;
          if (p.variableId) res.variableId = p.variableId;
          if (p.name) res.name = p.name;

          return res;
        });
      modifiedData.equipments = data.rects
        .filter((p) => p.content === "equipment")
        .map((p) => {
          const res = {
            id: p.id,
            pos: convertToPos(p.points),
            image: p.image,
          };

          return res;
        });
      modifiedData.links = data.rects
        .filter((p) => p.content === "link")
        .map((p) => {
          const res = {
            id: p.id,
            pos: convertToPos(p.points),
          };
          if (p.linkTo) res.to = parseInt(p.linkTo);

          return res;
        });
      modifiedData.indicators = data.rects
        .filter((p) => p.content === "indicator")
        .map((p) => {
          const res = {
            id: p.id,
            pos: convertToPos(p.points, "indicator"),
          };
          if (p.linkTo) res.linkTo = parseInt(p.linkTo);
          if (p.hideLogic) res.hideLogic = p.hideLogic;
          if (p.variant) res.type = p.variant;
          if (p.variableId) res.variableId = p.variableId;
          if (p.name) res.name = p.name;

          return res;
        });
      modifiedData.alarms = data.rects
        .filter((p) => p.content === "alarm")
        .map((p) => {
          const res = {
            id: p.id,
            pos: convertToPos(p.points),
          };
          if (p.variant) res.type = p.variant;
          if (p.variableId) res.variableId = p.variableId;

          return res;
        });
      modifiedData.sliders = data.rects
        .filter((p) => p.content === "slider")
        .map((p) => {
          const res = {
            id: p.id,
            pos: convertToPos(p.points),
          };
          if (p.color) res.color = p.color;
          if (p.variableId) res.variableId = p.variableId;

          return res;
        });

      return {
        id: p.id,
        parentId: p.parentId,
        type: "plant",
        ...modifiedData,
      };
    });
    exportData("export.json", res);
  };
  return (
    <>
      <div className="right-nav">
        {pages.length ? (
          <select
            value={currentPage}
            onChange={(e) => {
              setCurrentPage(parseInt(e.target.value));
            }}
            style={{ width: "100%" }}
          >
            {pages.map((option) => (
              <option key={option.id} value={option.id}>
                {option.id}
              </option>
            ))}
          </select>
        ) : null}
        <BackgroundSelector handleNewPage={handleNewPage} />
        <LoadData handleDataChange={handleLoadData} />
        <div>
          <button variant="primary" onClick={handleSave}>
            Save Data
          </button>
        </div>
        <div>
          <button variant="primary" onClick={handleExport}>
            Export Data
          </button>
        </div>
      </div>
      {pages
        .filter((p) => p.id === currentPage)
        .map((page) => (
          <Drawer
            key={page.id}
            pos={page.pos}
            image={page.image}
            data={page.data}
            setData={(data) => {
              setPages(
                pages.map((p) => {
                  if (p.id === page.id) {
                    return { ...p, data };
                  }
                  return p;
                })
              );
            }}
            setCurrentPage={setCurrentPage}
          />
        ))}
    </>
  );
}

export default App;
