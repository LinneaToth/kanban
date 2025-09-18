import { useDroppable } from "@dnd-kit/core";
import CreateItem from "./CreateItem";
import { useContext, useState, useEffect } from "react";
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
  const [edit, setEdit] = useState(false);

  const isFocused = searchParams.get("col") === String(id);

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

  //ESLint recommends useCallback, I don't know that hook yet but I will look into it
  function showSoloCol(colId: string): void {
    dispatch({ type: "showBaseCols", payload: false });
    dispatch({ type: "showOptionalCol", payload: colId });
    setSearchParams({ col: colId });
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-200/65 p-5 pt-3 w-[250px] flex flex-col rounded-2xl h-full 
  ">
      <nav className="flex flex-row border-b-1 border-slate-800 pb-2 pt-2 mb-3">
        <h2
          className=" font-base inline cursor-pointer text-lg mr-2"
          onClick={() => showSoloCol(id)}>
          {title}
        </h2>
        {isOptionalCol && (
          <>
            <button
              className="bg-slate-800 text-white p-1 align-middle text-center cursor-pointer ml-auto justify-self-end self-start rounded-full"
              onClick={() => dispatch({ type: "deleteCol", payload: id })}>
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
