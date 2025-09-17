import ModalContent from "./ModalContent";
import { useState, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { KanbanContext, KanbanDispatchContext } from "../context/KanbanContext";
import type { Column } from "../types/types";
import Input from "./Input";
import { RiStickyNoteAddLine } from "react-icons/ri";

export default function CreateItem() {
  const state = useContext(KanbanContext);
  const dispatch = useContext(KanbanDispatchContext);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [parent, setParent] = useState("00");

  useEffect(() => {
    localStorage.setItem("localKanban", JSON.stringify(state));
  }, [state]);

  const handleSubmit = (e): void => {
    e.preventDefault();
    setTitle("");
    setDescription("");
    setParent("00");
    dispatch({
      type: "newItem",
      payload: { title: title, description: description, parent: parent },
    });
    setShowModal(false);
  };

  return (
    <>
      <button
        className="flex justify-center cursor-pointer rounded-md bg-slate-800 py-2 px-4 border border-transparent text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mt-auto"
        onClick={() => setShowModal(true)}>
        Create item{" "}
        <RiStickyNoteAddLine
          size="15px"
          color="white"
          style={{ alignSelf: "center", marginLeft: "1rem" }}
        />
      </button>
      {showModal &&
        createPortal(
          <ModalContent
            showModal={showModal}
            onClose={() => {
              setShowModal(false);
            }}>
            <h2>New Item</h2>

            <form className="flex flex-col" onSubmit={(e) => handleSubmit(e)}>
              <Input
                type="text"
                name="title"
                value={title}
                labelText="Item title:"
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                type="textarea"
                name="description"
                labelText="Item description:"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Input
                type="select"
                name="parent"
                labelText="Category:"
                value={state.boards}
                onChange={(e) => setParent(e.target.value)}
              />

              <button
                type="submit"
                className="cursor-pointer rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                Add item
              </button>
            </form>
          </ModalContent>,
          document.body
        )}
    </>
  );
}
