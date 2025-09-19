import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { KanbanDispatchContext, KanbanContext } from "../context/KanbanContext";
import ModalContent from "./ModalContent";
import CreateColumn from "./CreateColumn";
import { useSearchParams } from "react-router-dom";

import { MdOutlineAddToPhotos } from "react-icons/md";
import { TbStack2Filled, TbCategory } from "react-icons/tb";
import { LuTimerReset } from "react-icons/lu";
import { AiOutlineClear } from "react-icons/ai";

export default function PageHeader() {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const state = useContext(KanbanContext);
  const dispatch = useContext(KanbanDispatchContext);
  const menuRef = useRef<HTMLDivElement>(null);
  const [, setSearchParams] = useSearchParams();

  if (!dispatch || !state) throw new Error("Context missing");

  useEffect(() => {
    localStorage.setItem("localKanban", JSON.stringify(state));
  }, [state]);

  const toggleExpand = () => setExpanded(expanded ? false : true);

  const onClose = useCallback(() => setExpanded(false), []); //UseCallback recommended by ESlint to prevent from unnecessary re-renders

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (expanded) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [expanded, onClose]);

  return (
    <header className="relative z-[100000] w-full h-7 bg-slate-800 text-white flex justify-start 2xl:h-[2.5rem] drop-shadow-lg">
      <button
        type="button"
        onClick={toggleExpand}
        className="ml-3 mr-3 cursor-pointer relative z-50">
        <TbStack2Filled className="text-white" />
      </button>
      <h1
        id="logo"
        className="inline mr-6 ml-3 cursor-pointer text-2xl 2xl:mt-1"
        onClick={() => {
          setSearchParams({});
          setTimeout(() => dispatch({ type: "resetLayout" }), 0);
        }}>
        myKanBan
      </h1>

      {expanded && (
        <nav
          ref={menuRef}
          className="absolute left-0 ml-7 top-7 mt-3 p-2 bg-slate-800/70 rounded-xl"
          style={{ zIndex: 99999 }}
          onClick={toggleExpand}>
          <ul>
            {state.boards
              .filter((b) => !["00", "01", "02"].includes(b.id))
              .map((board) => (
                <li
                  key={board.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setSearchParams({});
                    dispatch({ type: "showOptionalCol", payload: board.id });
                  }}>
                  <TbCategory className="text-white inline mr-1" />{" "}
                  {board.title}
                </li>
              ))}
            <li
              className="cursor-pointer border-t-1 border-white/60 mt-2"
              onClick={() => setShowModal(true)}>
              <MdOutlineAddToPhotos className="text-white inline mr-1" /> New
              Category
            </li>
            <li
              className="cursor-pointer"
              onClick={() => {
                setSearchParams({});
                dispatch({ type: "resetLayout" });
              }}>
              <LuTimerReset className="text-white inline mr-1" /> Reset layout
            </li>
            <li
              className="cursor-pointer"
              onClick={() => dispatch({ type: "clearBoard" })}>
              <AiOutlineClear className="text-white inline mr-1" /> Clear Kanban
            </li>
          </ul>
        </nav>
      )}

      {showModal &&
        createPortal(
          <ModalContent
            showModal={showModal}
            onClose={() => setShowModal(false)}>
            <CreateColumn
              setShowModal={setShowModal}
              setExpanded={setExpanded}
            />
          </ModalContent>,
          document.body
        )}
    </header>
  );
}
