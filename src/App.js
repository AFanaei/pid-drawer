import { useState } from "react";
import BackgroundSelector from "./components/BackgroundSelector";
import Drawer from "./components/Drawer";

function App() {
  const [image, setImage] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0, w: 0, h: 0 });
  return (
    <>
      {pos && pos.w && pos.h ? (
        <Drawer pos={pos} image={image} />
      ) : (
        <BackgroundSelector
          handleImageChange={setImage}
          handlePosChange={setPos}
        />
      )}
    </>
  );
}

export default App;
