import { useDraggable } from "@dnd-kit/core";
import { useState, useContext } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import ModalContent from "./ModalContent.tsx";
import dragIcon from "../assets/icons/drag_icon.svg";
import { KanbanContext, KanbanDispatchContext } from "../context/KanbanContext";
import Input from "./Input.tsx";
import Button from "./Button.tsx";
import type { Item } from "../types/types.ts";

interface KanbanItemProps {
  itemId: string;
}

export default function KanbanItem({ itemId }: KanbanItemProps) {
  const state = useContext(KanbanContext);
  const dispatch = useContext(KanbanDispatchContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentItem: Item = state.items.find((item) => item.id === itemId);
  const [edit, setEdit] = useState(false);
  const [editedItem, setEditedItem] = useState<Item>({
    ...currentItem,
    description: currentItem?.description ?? "",
  });

  if (!currentItem) return null;

  const isOpen = searchParams.get("itemid") === String(itemId);

  const handleDelete = () => {
    dispatch({ type: "deleteItem", payload: { id: currentItem.id } });
    setSearchParams({});
  };

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: currentItem.id,
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, zIndex: 99998 }}
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
        onClick={() => setSearchParams({ itemid: itemId })}>
        {currentItem.title}
      </h2>

      {isOpen &&
        createPortal(
          <ModalContent
            showModal={isOpen}
            onClose={() => setSearchParams({})}
            item={currentItem}>
            {edit ? (
              <>
                <Input
                  type="text"
                  name="title"
                  labelText="Title:"
                  value={editedItem.title}
                  onChange={(e) =>
                    setEditedItem({ ...editedItem, title: e.target.value })
                  }
                />
                <Input
                  type="textarea"
                  name="description"
                  labelText="Description:"
                  value={editedItem.description ?? ""}
                  onChange={(e) =>
                    setEditedItem({
                      ...editedItem,
                      description: e.target.value,
                    })
                  }
                />
              </>
            ) : (
              <>
                <h2 className="text-2xl">{currentItem.title}</h2>
                <p className="text-base mt-2">{currentItem.description}</p>
              </>
            )}

            <p
              className={`${
                edit
                  ? "cursor-pointer bg-gray-100 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow select-none mt-2 mb-4"
                  : "mb-4"
              }`}
              onClick={() => {
                if (edit)
                  setEditedItem({
                    ...editedItem,
                    archived: !editedItem.archived,
                  });
              }}>
              <strong>Status: </strong>
              {!editedItem.archived ? "Active" : "Archived"}
            </p>

            <Button onClick={handleDelete} bgcolor="red">
              DELETE
            </Button>

            <Button
              onClick={() => {
                if (edit) dispatch({ type: "updateItem", payload: editedItem });
                setEdit(!edit);
              }}>
              {edit ? "Save changes" : "EDIT"}
            </Button>
          </ModalContent>,
          document.body
        )}
    </div>
  );
}
