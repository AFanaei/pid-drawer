import { useCallback, useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";

function Background({ handleNewPage }) {
  const [show, setShow] = useState(false);
  const [id, setId] = useState(0);
  const [parentId, setParentId] = useState(0);
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
            handleNewPage(
              img,
              {
                x: left,
                y: top,
                w: img.width,
                h: img.height,
              },
              parseInt(id),
              parseInt(parentId)
            );
            handleClose();
          };
          img.src = fr.result;
        };
        fr.readAsDataURL(file);
      }
    },
    [setMessage, fileInput, handleClose, handleNewPage, id, parentId]
  );

  return (
    <>
      <div>
        <button variant="primary" onClick={handleShow}>
          Create new page
        </button>
      </div>
      <Modal show={show} onHide={handleClose}>
        <div className="window">
          <div className="title-bar">
            <div className="title-bar-text">New Page Info</div>
            <div className="title-bar-controls">
              <button aria-label="Close" onClick={handleClose}></button>
            </div>
          </div>
          <div className="window-body">
            <form onSubmit={onSubmit}>
              {message ? <p>{message}</p> : null}
              <div className="field-row">
                <label
                  htmlFor="image"
                  style={{ width: "50px", justifyContent: "end" }}
                >
                  Image
                </label>
                <input id="image" type="file" ref={fileInput} />
              </div>
              <div className="field-row">
                <label
                  htmlFor="id"
                  style={{ width: "50px", justifyContent: "end" }}
                >
                  ID
                </label>
                <input
                  id="id"
                  type="text"
                  value={id}
                  onChange={(e) => {
                    setId(e.target.value);
                  }}
                />
              </div>
              <div className="field-row">
                <label
                  htmlFor="parentId"
                  style={{ width: "50px", justifyContent: "end" }}
                >
                  Parent
                </label>
                <input
                  id="parentId"
                  type="text"
                  value={parentId}
                  onChange={(e) => {
                    setParentId(e.target.value);
                  }}
                />
              </div>
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
    </>
  );
}

export default Background;
