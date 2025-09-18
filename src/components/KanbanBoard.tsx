import React, { useContext, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { KanbanContext, KanbanDispatchContext } from "../context/KanbanContext";
import { useSearchParams } from "react-router-dom";

import KanbanColumn from "./KanbanColumn";
import KanbanItem from "./KanbanItem";
import type { Kanban, Column } from "../types/types";

export default function KanbanBoard(): React.JSX.Element {
  const state: Kanban = useContext(KanbanContext);
  const dispatch: () => void = useContext(KanbanDispatchContext);

  const [searchParams, setSearchParams] = useSearchParams(); //For connecting routing to the modal

  const visibleColumns: string[] = [];

  if (state.layout.baseShowing) {
    for (let i = 0; i < 3; i++) {
      visibleColumns[i] = state.boards[i].id;
    }
  }

  if (typeof state.layout.optionalCol === "string") {
    visibleColumns.push(state.layout.optionalCol);
  }

  function showSoloCol(colId: string): void {
    dispatch({ type: "showBaseCols", payload: false });
    dispatch({ type: "showOptionalCol", payload: colId });
    setSearchParams({ col: colId });
  }
  //Logic below ensures that the column with the requested item is visible
  useEffect(() => {
    const itemId = searchParams.get("itemid");
    if (!itemId) return;

    const item = state.items.find((i) => i.id === itemId);
    if (itemId && !item) {
      alert("No such item found!");
      return;
    }

    if (!visibleColumns.includes(item.parent)) {
      showSoloCol(item.parent);
    }
  }, [searchParams, state.items, visibleColumns, showSoloCol]);

  //Logic below ensures that the requested column is visible
  useEffect(() => {
    const colId = searchParams.get("col");
    const colShows: boolean = visibleColumns.includes(colId);

    if (colId && !colShows) {
      showSoloCol(colId);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("localKanban", JSON.stringify(state));
  }, [state]);

  return (
    <main className="flex w-full justify-center gap-3 h-10/12 mt-7 pl-7 pr-7">
      <DndContext onDragEnd={handleDragEnd}>
        {state.boards.map((column) =>
          visibleColumns.includes(column.id) ? (
            <KanbanColumn key={column.id} id={column.id} title={column.title}>
              {state.items
                .filter((item) => item.parent === column.id)
                .map((item) => {
                  return <KanbanItem key={item.id} itemId={item.id} />;
                })}
            </KanbanColumn>
          ) : null
        )}
      </DndContext>
    </main>
  );

  function handleDragEnd(event): void {
    const { active, over } = event;
    if (!over.id) return;

    dispatch({
      type: "moveToColumn",
      payload: { boardId: over.id, itemId: active.id },
    });
  }
}
