import { useDraggable } from "@dnd-kit/core";
import { useState, useContext } from "react";
import { createPortal } from "react-dom";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import ModalContent from "./ModalContent.tsx";
import dragIcon from "../assets/icons/drag_icon.svg";
import { KanbanContext, KanbanDispatchContext } from "../context/KanbanContext";
import Input from "./Input.tsx";
import Button from "./Button.tsx";
import type { Kanban, Item } from "../types/types.ts";

interface ItemDetailsProps {
  itemId: string;
}

export default function ItemDetails({ itemId }: ItemDetailsProps) {
  console.log("inside item details");

  const state: Kanban = useContext(KanbanContext)!;
  const dispatch = useContext(KanbanDispatchContext);

  const [edit, setEdit] = useState(false); //is the item currently being editable or not?
  const [searchParams, setSearchParams] = useSearchParams();

  const currentItem: Item = state.items.find((item) => item.id === itemId);
  const [editedItem, setEditedItem] = useState<Item>({
    ...currentItem,
    description: currentItem.description ?? "",
  });

  const isOpen = searchParams.get("itemid") === String(itemId);

  const handleDelete = () => {
    dispatch({ type: "deleteItem", payload: { id: currentItem.id } });
    setSearchParams({}); // clean url and close modal after delete
  };

  /* below, dnd setup */
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: currentItem.id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  /* above, dnd setup*/

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, zIndex: "99998" }}
      {...attributes}
      className="bg-gray-300/85 text-black p-3 mb-3 rounded-xl w-full self-center grid grid-cols-6">
      <img
        className="col-start-1 col-span-1 cursor-grab self-center"
        src={dragIcon}
        style={{ width: "20px" }}
        alt="Icon Drag"
        {...listeners}
      />
      <h2
        className="text-base col-start-2 col-span-5 self-center cursor-pointer"
        onClick={() => setSearchParams({ itemid: currentItem.id })}>
        {" "}
        {currentItem.title}{" "}
      </h2>
      {isOpen &&
        createPortal(
          <ModalContent
            showModal={isOpen}
            item={currentItem}
            onClose={() => setSearchParams({})}>
            {edit ? (
              <>
                {" "}
                <Input
                  name="title"
                  type="text"
                  labelText="Title:"
                  value={editedItem.title}
                  onChange={(e) =>
                    setEditedItem({ ...editedItem, title: e.target.value })
                  }
                />
              </>
            ) : (
              <h2 className="text-2xl">{currentItem.title}</h2>
            )}

            {!edit ? (
              <p className="text-base italic">{currentItem.date}</p>
            ) : (
              ""
            )}

            {edit ? (
              <>
                <label
                  className="block mb-1 mt-2 text-sm text-slate-600"
                  htmlFor={"description"}>
                  {labelText}
                </label>{" "}
                <textarea
                  id={"description"}
                  className="w-full bg-gray-100 placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  name={"description"}
                  value={editedItem.description}
                  onChange={(e) =>
                    setEditedItem({
                      ...editedItem,
                      description: e.target.value,
                    })
                  }
                />
              </>
            ) : (
              <p className="text-base mt-2">
                {" "}
                <strong>Description: </strong>
                {currentItem.description}
              </p>
            )}

            <p
              className={`${
                edit
                  ? "cursor-pointer bg-gray-100 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow select-none mt-2 mb-4"
                  : "mb-4"
              }`}
              onClick={() => {
                if (edit) {
                  setEditedItem({
                    ...editedItem,
                    archived: !editedItem.archived,
                  });
                }
              }}>
              <strong>Status: </strong>
              {!editedItem.archived ? "Active" : "Archived"}
            </p>

            <Button onClick={handleDelete}>DELETE</Button>

            <Button
              onClick={() => {
                if (edit) dispatch({ type: "updateItem", payload: editedItem });
                setEdit(!edit);
              }}>
              {edit ? "Save changes" : <>EDIT</>}
            </Button>
          </ModalContent>,
          document.body
        )}
    </div>
  );
}
