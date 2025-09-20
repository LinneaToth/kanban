import { useState, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import { useDraggable } from "@dnd-kit/core";

//Project specific imports
import ModalContent from "./ModalContent.tsx";
import { KanbanContext, KanbanDispatchContext } from "../context/KanbanContext";
import Input from "./Input.tsx";
import Button from "./Button.tsx";
import type { Item } from "../types/types.ts";
import type { KanbanItemProps } from "../types/types.ts";

//ICONS
import { GrDrag } from "react-icons/gr";

export default function KanbanItem({ itemId }: KanbanItemProps) {
  const state = useContext(KanbanContext);
  const dispatch = useContext(KanbanDispatchContext);
  const [searchParams, setSearchParams] = useSearchParams();

  //Is the item currently editable? If so, edits are stored in a temporary state
  const [edit, setEdit] = useState(false);
  const [editedItem, setEditedItem] = useState<Item | null>(null);

  const currentItem = state?.items.find((item) => item.id === itemId);

  if (!currentItem || !state || !dispatch)
    throw new Error("Something is missing!");

  //Whenever an item is focused, there will always be a matching URL with corresponding params
  const isOpen = searchParams.get("itemid") === String(itemId);

  //Syncs the (temporary) edited item with the targeted item, whenever the targeted item is changed
  useEffect(() => {
    if (currentItem) {
      setEditedItem({
        ...currentItem,
        description: currentItem.description ?? "",
      });
    }
  }, [currentItem]);

  //Logic for updating state when item is edited
  const handleToggleEdit = () => {
    if (edit) {
      if (editedItem) {
        dispatch({ type: "updateItem", payload: editedItem });
      }
      setEditedItem(null);
      setEdit(false);
    } else {
      setEditedItem({
        ...currentItem,
        description: currentItem.description ?? "",
      });
      setEdit(true);
    }
  };

  const handleDelete = () => {
    setSearchParams({});
    dispatch({ type: "deleteItem", payload: { id: currentItem.id } });
    setEditedItem(null);
    setEdit(false);
  };

  //When the item modal closes, we no longer need a targeting URL, we are not editing and do not need a temporary item
  const handleCloseModal = () => {
    setSearchParams({});
    setEdit(false);
    setEditedItem(null);
  };

  //DND-code below
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: currentItem.id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;
  //DND-code above

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, zIndex: 99997, touchAction: "manipulation" }}
      {...attributes}
      className="bg-gray-100/85 text-slate-800 p-3 mb-3 rounded-xl w-full self-center grid grid-cols-6 align-middle">
      <GrDrag
        {...listeners}
        className={"self-center text-slate-800 cursor-grab"}
      />
      <h2
        className="col-start-2 col-span-5 self-center cursor-pointer text-sm font-light select-none"
        onClick={() => setSearchParams({ itemid: itemId })}>
        {currentItem.title}
      </h2>

      {isOpen &&
        createPortal(
          <ModalContent showModal={isOpen} onClose={handleCloseModal}>
            {edit && editedItem ? (
              // EDIT MODE: editedItem is guaranteed non-null here, these guards are here to please TypeScript
              <>
                <Input
                  type="text"
                  name="title"
                  labelText="Title:"
                  value={editedItem.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditedItem((prev) =>
                      prev ? { ...prev, title: e.target.value } : prev
                    )
                  }
                />

                <Input
                  type="textarea"
                  name="description"
                  labelText="Description:"
                  value={editedItem.description ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setEditedItem((prev) =>
                      prev ? { ...prev, description: e.target.value } : prev
                    )
                  }
                />

                <Input
                  type="select"
                  name="parent"
                  labelText="Category:"
                  options={state.boards}
                  value={editedItem.parent}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setEditedItem((prev) =>
                      prev ? { ...prev, parent: e.target.value } : prev
                    )
                  }
                />

                <div className="flex gap-2 mt-3">
                  <Button onClick={handleDelete}>DELETE</Button>
                  <Button onClick={handleToggleEdit}>Save changes</Button>
                  <Button
                    onClick={() => {
                      setEdit(false);
                      setEditedItem(null);
                    }}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              // VIEW MODE
              <>
                <h2 className="mb-1 text-slate-600">{currentItem.title}</h2>
                <p className="text-xs italic text-slate-600">
                  {currentItem.date}
                </p>
                <p className="text-sm mt-2 text-slate-600">
                  <strong>Description: </strong> {currentItem.description}
                </p>
                <p className="mt-2 text-slate-600 text-sm">
                  <strong>Category: </strong>{" "}
                  {state.boards.find((c) => c.id === currentItem.parent)
                    ?.title ?? "—"}
                </p>

                <div className="flex gap-2 mt-3">
                  <Button onClick={handleDelete}>DELETE</Button>
                  <Button onClick={handleToggleEdit}>EDIT</Button>
                </div>
              </>
            )}
          </ModalContent>,
          document.body
        )}
    </div>
  );
}
