import { useDraggable } from "@dnd-kit/core";
import { useState, useContext } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import ModalContent from "./ModalContent.tsx";
import dragIcon from "../assets/icons/drag_icon.svg";
import { KanbanContext, KanbanDispatchContext } from "../context/KanbanContext";
import Button from "./Button.tsx";

export default function KanbanItem({ currentItem }) {
  // const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editedItem, setEditedItem] = useState(currentItem);
  const state = useContext(KanbanContext);
  const dispatch = useContext(KanbanDispatchContext);
  const [searchParams, setSearchParams] = useSearchParams(); //For connecting routing to the modal

  const isOpen = searchParams.get("itemid") === String(currentItem.id);

  const handleDelete = () => {
    dispatch({ type: "deleteItem", payload: { id: currentItem.id } });
    setSearchParams({});
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
      className="bg-gray-300/85 text-black p-3 mt-3 rounded-xl max-w-[200px] self-center">
      <img
        className="inline cursor-grab"
        src={dragIcon}
        style={{ width: "20px" }}
        alt="Icon Drag"
        {...listeners}
      />
      <h2 className="text-base inline"> {currentItem.title} </h2>

      <Button onClick={() => setSearchParams({ itemid: currentItem.id })}>
        Show Details
      </Button>
      {isOpen &&
        createPortal(
          <ModalContent
            showModal={isOpen}
            item={currentItem}
            onClose={() => setSearchParams({})}>
            {edit ? (
              <>
                {" "}
                <input
                  className="border-2 block"
                  name="title"
                  type="text"
                  value={editedItem.title}
                  onChange={(e) =>
                    setEditedItem({ ...editedItem, title: e.target.value })
                  }
                />{" "}
              </>
            ) : (
              <h2 className="text-2xl">{currentItem.title}</h2>
            )}
            <p className="text-base italic">Date of creation</p>

            {edit ? (
              <>
                <textarea
                  className="border-2 block"
                  name="description"
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
              <p className="text-base mt-5">
                {" "}
                <strong>Description: </strong>
                {currentItem.description}
              </p>
            )}

            <p
              className="text-base mt-5"
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

            <Button onClick={handleDelete} bgcolor="red">
              DELETE
            </Button>

            <Button
              onClick={() => {
                if (edit) dispatch({ type: "updateItem", payload: editedItem });
                setEdit(!edit);
              }}>
              {edit ? "Save changes" : "Edit"}
            </Button>
          </ModalContent>,
          document.body
        )}
    </div>
  );
}
