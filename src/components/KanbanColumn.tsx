import { useDroppable } from "@dnd-kit/core";
import CreateItem from "./CreateItem";
import { useContext, useEffect } from "react";
import { KanbanContext } from "../context/KanbanContext";
import { KanbanDispatchContext } from "../context/KanbanContext";
import { useSearchParams } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";

interface KanbanColumnProps {
  id: string;
  children: React.ReactNode;
  title: string;
}

export default function KanbanColumn({
  id,
  children,
  title,
}: KanbanColumnProps) {
  const state = useContext(KanbanContext);
  const dispatch = useContext(KanbanDispatchContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const isFocused = searchParams.get("col") === String(id);

  if (!dispatch) throw new Error("Dispatch is missing!");
  if (!state) throw new Error("Kanban is missing!");

  useEffect(() => {
    localStorage.setItem("localKanban", JSON.stringify(state));
  }, [state]);

  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });
  const style = {
    filter: isOver ? "brightness(120%)" : undefined,
  };

  useEffect(() => {
    if (isFocused) {
      dispatch({ type: "showOptionalCol", payload: id });
      dispatch({ type: "showBaseCols", payload: false });
    }
  }, [isFocused, dispatch, id]);

  const isOptionalCol = id !== "00" && id !== "01" && id !== "02";

  const showSoloCol = (colId: string): void => {
    dispatch({ type: "showBaseCols", payload: false });
    dispatch({ type: "showOptionalCol", payload: colId });
    setSearchParams({ col: colId });
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, zIndex: "99993" }}
      className={
        (isFocused ? " w-full " : " w-[90%] sm:w-[45%]  ") +
        "bg-gray-200/65 p-5 pt-3 md:w-[250px] flex flex-col rounded-2xl min-h-[40vh] md:self-start drop-shadow-md"
      }>
      <nav className="flex flex-row border-b-1 border-slate-400 pb-2 pt-2 mb-3">
        <h2
          className=" font-base inline cursor-pointer text-lg mr-2 text-slate-800"
          onClick={() => showSoloCol(id)}>
          {title}
        </h2>
        {isOptionalCol && (
          <>
            <button
              className="bg-slate-800 text-white p-1 align-middle text-center cursor-pointer ml-auto justify-self-end self-start rounded-full"
              onClick={() => {
                setSearchParams({});
                dispatch({ type: "deleteCol", payload: id });
              }}>
              <RiDeleteBin5Line />
            </button>
            <button
              className="bg-slate-800 text-white p-1 align-middle text-center cursor-pointer ml-1 justify-self-end self-start rounded-full"
              onClick={() => dispatch({ type: "deleteCol", payload: "id" })}>
              <FaRegEdit />
            </button>
          </>
        )}
      </nav>

      {children}
      {state.layout.baseShowing && id === "00" && <CreateItem />}
      {id === state.layout.optionalCol && !state.layout.baseShowing && (
        <CreateItem />
      )}
    </div>
  );
}
