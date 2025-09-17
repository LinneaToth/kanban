import { useContext, useState } from "react";
import { createPortal } from "react-dom";
import { KanbanDispatchContext } from "../context/KanbanContext";
import { KanbanContext } from "../context/KanbanContext";
import ModalContent from "./ModalContent";
import Input from "./Input";

export default function Nav() {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const state = useContext(KanbanContext);
  const dispatch = useContext(KanbanDispatchContext);

  const toggleExpand = () => {
    setExpanded((expanded) => !expanded);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "addOptionalCol", payload: newCategory });
    setNewCategory("");
    setShowModal(false);
    setExpanded(false);
  };

  return (
    <>
      <h1
        className="inline mr-6 ml-3 cursor-pointer"
        onClick={() => {
          dispatch({ type: "showBaseCols", payload: true });
          dispatch({ type: "showOptionalCol", payload: "" });
        }}>
        myKanBan
      </h1>

      <button
        className={"justify-self-end mr-9 cursor-pointer"}
        onClick={() => setExpanded((expanded) => !expanded)}>
        Custom categories
      </button>

      {expanded ? (
        <nav
          className="absolute right-0 mr-7 top-7 p-2 bg-white/70 backdrop-blur-sm rounded-xl border-black border-2"
          style={{ zIndex: "99999999" }}>
          <ul>
            {state.boards.map(
              (board) =>
                board.id !== "00" &&
                board.id !== "01" &&
                board.id !== "02" && (
                  <li
                    key={board.id}
                    className="cursor-pointer"
                    value={board.id}
                    onClick={() =>
                      dispatch({ type: "showOptionalCol", payload: board.id })
                    }>
                    {board.title}
                  </li>
                )
            )}
            <li className="cursor-pointer" onClick={() => setShowModal(true)}>
              + New Category
            </li>
          </ul>
        </nav>
      ) : (
        ""
      )}

      {showModal &&
        createPortal(
          <ModalContent
            showModal={showModal}
            onClose={() => {
              setShowModal(false);
            }}>
            <h2>New Category</h2>

            <form className="flex flex-col" onSubmit={(e) => handleSubmit(e)}>
              <Input
                type="text"
                name="title"
                value={newCategory}
                labelText="Category Name:"
                onChange={(e) => setNewCategory(e.target.value)}
              />

              <button
                type="submit"
                className="mt-4 cursor-pointer rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                Add category
              </button>
            </form>
          </ModalContent>,
          document.body
        )}
    </>
  );
}
