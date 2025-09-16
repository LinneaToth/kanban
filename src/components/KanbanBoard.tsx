import React, { useContext } from "react";
import { DndContext } from "@dnd-kit/core";
import { KanbanContext, KanbanDispatchContext } from "../context/KanbanContext";

import KanbanColumn from "./KanbanColumn";
import KanbanItem from "./KanbanItem";
import type { Kanban, Column } from "../types/types";

export default function KanbanBoard(): React.JSX.Element {
  const state: Kanban = useContext(KanbanContext);
  const dispatch: Kanban = useContext(KanbanDispatchContext);

  const visibleColumns: string[] = [];

  if (state.layout.baseShowing) {
    for (let i = 0; i < 3; i++) {
      visibleColumns[i] = state.boards[i].id;
    }
  }

  if (typeof state.layout.optionalCol === "string") {
    visibleColumns.push(state.layout.optionalCol);
  }

  return (
    <main className="flex w-full justify-center gap-3 h-10/12 mt-7 pl-7 pr-7">
      <DndContext onDragEnd={handleDragEnd}>
        {state.boards.map((column) =>
          visibleColumns.includes(column.id) ? (
            <KanbanColumn key={column.id} id={column.id}>
              <h2 className="text-xl font-semibold mb-3">
                {column.title.toUpperCase()}
              </h2>
              {state.items
                .filter((item) => item.parent === column.id)
                .map((item) => (
                  <KanbanItem key={item.id} itemId={item.id} />
                ))}
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
