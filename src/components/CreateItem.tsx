import ModalContent from "./ModalContent";
import { useState, useContext } from "react";
import { createPortal } from "react-dom";
import { KanbanContext, KanbanDispatchContext } from "../context/KanbanContext";
import type { Column } from "../types/types";

export default function CreateItem() {
  const state = useContext(KanbanContext);
  const dispatch = useContext(KanbanDispatchContext);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [parent, setParent] = useState("00");

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
        className="ml-auto mt-auto hover:cursor-pointer"
        onClick={() => setShowModal(true)}>
        Create item +
      </button>
      {showModal &&
        createPortal(
          <ModalContent
            showModal={showModal}
            onClose={() => {
              setShowModal(false);
              console.log("closing…");
            }}>
            <h2>New Item</h2>
            <form className="flex flex-col" onSubmit={(e) => handleSubmit(e)}>
              <label className="block" htmlFor="title">
                Item title:
              </label>
              <input
                className="border-2 block"
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label className="block" htmlFor="description">
                Item description:
              </label>
              <textarea
                className="border-2 block"
                name="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <label className="block" htmlFor="parent">
                Category:
              </label>
              <select
                className="block border-2"
                onChange={(e) => setParent(e.target.value)}>
                {state.boards.map((board: Column) => {
                  return (
                    <option key={board.id} value={board.id}>
                      {board.title}
                    </option>
                  );
                })}
              </select>

              <button type="submit">Add new item +</button>
            </form>
          </ModalContent>,
          document.body
        )}
    </>
  );
}
