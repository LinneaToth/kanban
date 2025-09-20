import React, { useContext, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  type DragEndEvent,
} from "@dnd-kit/core";

//Project specific imports
import { KanbanContext, KanbanDispatchContext } from "../context/KanbanContext";
import KanbanColumn from "./KanbanColumn";
import KanbanItem from "./KanbanItem";
import type { Kanban } from "../types/types";
import { computeVisibleColumns } from "../utils/utils";

export default function KanbanBoard(): React.JSX.Element {
  const state: Kanban | null = useContext(KanbanContext);
  const dispatch = useContext(KanbanDispatchContext);

  if (!state) throw new Error("State is missing");
  if (!dispatch) throw new Error("KanbanDispatchContext is missing");

  const [searchParams, setSearchParams] = useSearchParams(); //URL for routing

  // Visible columns based on layout state, computation added to a useMemo to avoid unnecessary re-rendering
  const visibleColumns = useMemo(() => {
    return computeVisibleColumns(state);
  }, [state]);

  // Effect dealing with item urls
  useEffect(() => {
    const itemId = searchParams.get("itemid"); //Is anybody looking for an item?
    if (!itemId) return; //No? No need to run the code then, carry on.

    const item = state.items.find((i) => i.id === itemId);
    if (!item) {
      console.warn("No such item found:", itemId);
      return;
    }

    //If URL is asking for an item, and it isn't shown - bring it on!
    if (!visibleColumns.includes(item.parent)) {
      dispatch({ type: "showBaseCols", payload: false });
      dispatch({ type: "showOptionalCol", payload: item.parent });
    }
  }, [searchParams, state.items, visibleColumns, dispatch]);

  // Effect dealing with column URLS
  useEffect(() => {
    const colId = searchParams.get("col"); //is anybody even looking for a column?
    if (!colId) return; //If not, don't bother

    if (!state.boards.find((board) => board.id === colId)) {
      setSearchParams({}); //if the board doesn't exist, another good time to not bother
      return;
    }
    //All clear? Let's go, show the requested col!
    dispatch({ type: "showBaseCols", payload: false });
    dispatch({ type: "showOptionalCol", payload: colId });
  }, [setSearchParams, searchParams, state.boards, dispatch]);

  //Any time the state (containing all info on the Kanban-board is updated, it is saved to local storage)
  useEffect(() => {
    localStorage.setItem("localKanban", JSON.stringify(state));
  }, [state]);

  //DND-code below, setting up sensors for mouse and touch, & events for dragging the items:
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5, // pixels to move before drag starts
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 150, // ms press delay before dragging
      tolerance: 5, // movement allowed during delay
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (!over || !over.id) return;

    if (dispatch)
      //guard clause ^ Code below adds the target container to the state
      dispatch({
        type: "moveToColumn",
        payload: { boardId: String(over.id), itemId: String(active.id) },
      });
  }
  //DND-code above

  return (
    <main className="min-h-[70%] flex flex-wrap md:flex-nowrap sm:ml-[7%] md:ml-auto flex-row justify-center sm:justify-start md:justify-center gap-4 md:gap-5 mt-7 pl-7 pr-7 ">
      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
        {state.boards.map(
          (column) =>
            visibleColumns.includes(column.id) && (
              <KanbanColumn key={column.id} id={column.id} title={column.title}>
                {state.items
                  .filter((item) => item.parent === column.id)
                  .map((item) => (
                    <KanbanItem key={item.id} itemId={item.id} />
                  ))}
              </KanbanColumn>
            )
        )}
      </DndContext>
    </main>
  );
}
