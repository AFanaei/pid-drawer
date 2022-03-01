import { useCallback, useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";

function Background({ handlePosChange, handleImageChange }) {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const fileInput = useRef(null);
  const handleClose = useCallback(() => setShow(false), [setShow]);
  const handleShow = useCallback(() => setShow(true), [setShow]);
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (typeof window.FileReader !== "function") {
        setMessage("The file API isn't supported on this browser yet.");
        return;
      }

      if (!fileInput.current) {
        setMessage("Um, couldn't find the imgfile element.");
      } else if (!fileInput.current.files) {
        setMessage(
          "This browser doesn't seem to support the `files` property of file inputs."
        );
      } else if (!fileInput.current.files[0]) {
        setMessage("Please select a file before clicking 'Load'");
      } else {
        const file = fileInput.current.files[0];
        const fr = new FileReader();
        fr.onload = () => {
          const img = new Image();
          img.onload = () => {
            const left = window.innerWidth / 2 - img.width / 2;
            const top = window.innerHeight / 2 - img.height / 2;
            handleImageChange(img);
            handlePosChange({ x: left, y: top, w: img.width, h: img.height });
            handleClose();
          };
          img.src = fr.result;
        };
        fr.readAsDataURL(file);
      }
    },
    [setMessage, fileInput, handleClose, handlePosChange, handleImageChange]
  );

  return (
    <div>
      <button variant="primary" onClick={handleShow}>
        Load Background
      </button>
      <Modal show={show} onHide={handleClose}>
        <div className="window" style={{ width: "100%" }}>
          <div className="title-bar">
            <div className="title-bar-text">Select Image</div>
            <div className="title-bar-controls">
              <button aria-label="Close" onClick={handleClose}></button>
            </div>
          </div>
          <div className="window-body">
            <form onSubmit={onSubmit}>
              {message ? <p>{message}</p> : null}
              <input type="file" ref={fileInput} />
              <section
                className="field-row"
                style={{ justifyContent: "flex-end" }}
              >
                <button type="submit">OK</button>
                <button onClick={handleClose}>Cancel</button>
              </section>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Background;
