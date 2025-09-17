import { useDroppable } from "@dnd-kit/core";
import CreateItem from "./CreateItem";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { KanbanContext } from "../context/KanbanContext";
import { KanbanDispatchContext } from "../context/KanbanContext";

export default function KanbanColumn({ id, children }) {
  const state = useContext(KanbanContext);
  const dispatch = useContext(KanbanDispatchContext);

  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });
  const style = {
    filter: isOver ? "brightness(120%)" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-200/65 p-5 pt-8 w-[250px] flex flex-col rounded-2xl h-full 
  ">
      {children}
      {state.layout.baseShowing && id === "00" && <CreateItem />}
      {id === state.layout.optionalCol && !state.layout.baseShowing && (
        <CreateItem />
      )}
    </div>
  );
}
