import { useContext, useEffect, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useSearchParams } from "react-router-dom";

//Project specific imports
import { KanbanContext } from "../context/KanbanContext";
import { KanbanDispatchContext } from "../context/KanbanContext";
import Input from "./Input";
import CreateItem from "./CreateItem";
import type { KanbanColumnProps } from "../types/types";

//ICONS
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { FaRegSave } from "react-icons/fa";

export default function KanbanColumn({
  id,
  children,
  title,
}: KanbanColumnProps) {
  const state = useContext(KanbanContext);
  const dispatch = useContext(KanbanDispatchContext);
  const [searchParams, setSearchParams] = useSearchParams();

  //State dealing with editing the category name. newCategory is a temporary storage for the new name, edit lets the app know if we are currently editing or not
  const [newCategory, setNewCategory] = useState("");
  const [edit, setEdit] = useState(false);

  const isFocused = searchParams.get("col") === String(id); //Is the layout currently focused on the column being rendered?

  if (!dispatch) throw new Error("Dispatch is missing!");
  if (!state) throw new Error("Kanban is missing!");

  //DND-code below
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });
  const style = {
    filter: isOver ? "brightness(120%)" : undefined,
  };
  //DND-code above

  //If the URL points towards the column being rendered, update layout accordingly
  useEffect(() => {
    if (isFocused) {
      dispatch({ type: "showOptionalCol", payload: id });
      dispatch({ type: "showBaseCols", payload: false });
    }
  }, [isFocused, dispatch, id]);

  //00, 01 and 02 (todo, doing, done) belong to the base layout and aren't optional.
  const isOptionalCol = id !== "00" && id !== "01" && id !== "02";

  //If header is clicked, URL is updated with the corresponding params (column id) and the layout in the state is updated
  const showSoloCol = (colId: string): void => {
    dispatch({ type: "showBaseCols", payload: false });
    dispatch({ type: "showOptionalCol", payload: colId });
    setSearchParams({ col: colId });
  };

  const handleSubmitChange = () => {
    dispatch({
      type: "editCol",
      payload: { id: id, title: newCategory },
    });
    setNewCategory("");
    setEdit(false);
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
        {/*if editing, show the input field. If not, just render the header. */}
        {edit ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitChange();
            }}>
            <Input
              type="text"
              name="title"
              value={newCategory ? newCategory : title}
              labelText="Category:"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewCategory((e.target as HTMLInputElement).value)
              }
            />
          </form>
        ) : (
          <h2
            className=" font-base inline cursor-pointer text-lg mr-2 text-slate-800"
            onClick={() => showSoloCol(id)}>
            {title}
          </h2>
        )}
        {/*only show the editing options if it is one of the custom columns. The base ones aren't supposed to be changed*/}
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
              onClick={() => {
                if (edit) {
                  handleSubmitChange();
                } else if (!edit) {
                  setNewCategory(title);
                  setEdit(true);
                }
              }}>
              {edit ? <FaRegSave /> : <FaRegEdit />}
            </button>
          </>
        )}
      </nav>

      {children}
      {/* create item only shows on the first column if the base layout is visible. It shows on any column that is focused */}
      {state.layout.baseShowing && id === "00" && <CreateItem />}
      {id === state.layout.optionalCol && !state.layout.baseShowing && (
        <CreateItem />
      )}
    </div>
  );
}
