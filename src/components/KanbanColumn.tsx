import { useDroppable } from "@dnd-kit/core";
import CreateItem from "./CreateItem";
import addIcon from "../assets/icons/add_icon.svg";

export default function KanbanColumn({ id, children }) {
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
      {id === "00" && <CreateItem />}
    </div>
  );
}
