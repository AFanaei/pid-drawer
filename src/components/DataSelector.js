import { useCallback, useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";

function LoadData({ handleDataChange }) {
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
        fr.onload = (e) => {
          handleDataChange(JSON.parse(e.target.result));
          handleClose();
        };
        fr.readAsText(file);
      }
    },
    [setMessage, fileInput, handleClose]
  );

  return (
    <div>
      <button variant="primary" onClick={handleShow}>
        Load Data
      </button>
      <Modal show={show} onHide={handleClose}>
        <div className="window" style={{ width: "100%" }}>
          <div className="title-bar">
            <div className="title-bar-text">Select data</div>
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

export default LoadData;
