import { useContext, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { KanbanDispatchContext } from "../context/KanbanContext";
import { KanbanContext } from "../context/KanbanContext";
import ModalContent from "./ModalContent";
import CreateColumn from "./CreateColumn";
import { useSearchParams } from "react-router-dom";

//Icons import
import { MdOutlineAddToPhotos } from "react-icons/md";
import { TbStack2Filled } from "react-icons/tb";
import { LuTimerReset } from "react-icons/lu";
import { TbCategory } from "react-icons/tb";
import { AiOutlineClear } from "react-icons/ai";

export default function PageHeader() {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const state = useContext(KanbanContext);
  const dispatch = useContext(KanbanDispatchContext);
  const menuRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    localStorage.setItem("localKanban", JSON.stringify(state));
  }, [state]);

  const toggleExpand = () => {
    setExpanded((expanded) => !expanded);
  };

  const onClose = () => {
    setExpanded(false);
  };

  // Close nav on outside click
  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
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
    <header className="w-full h-7 bg-slate-800 text-white flex justify-start">
      <button
        className={"justify-self-start mr-3 ml-3 cursor-pointer"}
        onClick={() => setExpanded((expanded) => !expanded)}>
        <TbStack2Filled className="text-white" />
      </button>

      <h1
        id="logo"
        className="inline mr-6 ml-3 cursor-pointer text-2xl"
        onClick={() => {
          setSearchParams({});
          dispatch({ type: "showBaseCols", payload: true });
          dispatch({ type: "showOptionalCol", payload: "" });
        }}>
        myKanBan
      </h1>

      {expanded ? (
        <nav
          ref={menuRef}
          className="absolute left-0 ml-7 top-7 mt-3 p-2 bg-slate-800/70 backdrop-blur-sm rounded-xl"
          style={{ zIndex: "99999999" }}
          onClick={() => toggleExpand()}>
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
                    onClick={() => {
                      dispatch({ type: "showOptionalCol", payload: board.id });
                      if (state.layout.showBaseCols === true) {
                        setSearchParams({});
                      } else {
                        setSearchParams({ col: board.id });
                      }
                    }}>
                    <TbCategory className="text-white inline mr-1" />{" "}
                    {board.title}
                  </li>
                )
            )}
            <li
              className="cursor-pointer border-t-1 border-white/60 mt-2"
              onClick={() => {
                setSearchParams({});
                setShowModal(true);
              }}>
              <MdOutlineAddToPhotos className="text-white inline mr-1 " /> New
              Category
            </li>
            <li
              className="cursor-pointer"
              onClick={() => {
                setSearchParams({});
                dispatch({ type: "showBaseCols", payload: true });
                dispatch({ type: "showOptionalCol", payload: "" });
              }}>
              <LuTimerReset className="text-white inline mr-1" /> Reset layout
            </li>
            <li
              className="cursor-pointer"
              onClick={() => {
                setSearchParams({});
                dispatch({ type: "clearBoard" });
              }}>
              <AiOutlineClear className="text-white inline mr-1" /> Clear Kanban
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
