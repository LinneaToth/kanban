import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSearchParams } from "react-router-dom";

//Project specific imports
import { KanbanDispatchContext } from "../context/KanbanContext";
import { KanbanContext } from "../context/KanbanContext";
import Input from "./Input";
import type { CreateColumnProps } from "../types/types";

export default function CreateColumn({
  setShowModal,
  setExpanded,
}: CreateColumnProps) {
  const dispatch = useContext(KanbanDispatchContext);
  const state = useContext(KanbanContext);

  //Temporary state for controlling the input field
  const [newCategory, setNewCategory] = useState("");

  //For updating the routing params
  const [, setSearchParams] = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newId: string = "col-" + uuidv4().slice(0, 8);
    if (dispatch) {
      dispatch({
        type: "addOptionalCol",
        payload: { title: newCategory, id: newId },
      });
    }
    setNewCategory("");
    setShowModal(false);
    setExpanded(false);
    if (state && !state.layout.baseShowing) setSearchParams({ col: newId });
  };

  return (
    <>
      {" "}
      <h2>New Category</h2>
      <form
        className="flex flex-col"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
        <Input
          type="text"
          name="title"
          value={newCategory}
          labelText="Category Name:"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewCategory((e.target as HTMLInputElement).value)
          }
        />

        <button
          type="submit"
          className="mt-4 cursor-pointer rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
          Add category
        </button>
      </form>
    </>
  );
}
