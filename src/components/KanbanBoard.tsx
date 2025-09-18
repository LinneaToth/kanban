import React, { useContext, useMemo, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { KanbanContext, KanbanDispatchContext } from "../context/KanbanContext";
import { useSearchParams } from "react-router-dom";
import type { DragEndEvent } from "@dnd-kit/core";

import KanbanColumn from "./KanbanColumn";
import KanbanItem from "./KanbanItem";
import type { Kanban } from "../types/types";

export default function KanbanBoard(): React.JSX.Element {
  const state: Kanban | null = useContext(KanbanContext);
  const dispatch = useContext(KanbanDispatchContext);

  if (!state) throw new Error("State is missing");
  if (!dispatch) throw new Error("KanbanDispatchContext is missing");

  const [searchParams, setSearchParams] = useSearchParams();

  // Compute visible columns based on layout state
  const visibleColumns = useMemo(() => {
    const cols: string[] = [];
    if (state.layout.baseShowing) {
      for (let i = 0; i < 3; i++) {
        cols.push(state.boards[i].id);
      }
    }
    if (state.layout.optionalCol) {
      cols.push(state.layout.optionalCol);
    }
    return cols;
  }, [state.layout, state.boards]);

  // Effect dealing with item urls
  useEffect(() => {
    const itemId = searchParams.get("itemid");
    if (!itemId) return;

    const item = state.items.find((i) => i.id === itemId);
    if (!item) {
      console.warn("No such item found:", itemId);
      return;
    }

    if (!visibleColumns.includes(item.parent)) {
      dispatch({ type: "showBaseCols", payload: false });
      dispatch({ type: "showOptionalCol", payload: item.parent });
    }
  }, [searchParams, state.items, visibleColumns, dispatch]);

  // Effect dealing with column URLS - doesn't work
  useEffect(() => {
    const colId = searchParams.get("col"); //is anybody even looking for a column?
    if (!colId) return; //If not, don't bother

    if (!state.boards.find((board) => board.id === colId)) {
      setSearchParams({}); //if the board doesn't exist, don't bother
      return;
    }
    dispatch({ type: "showBaseCols", payload: false });
    dispatch({ type: "showOptionalCol", payload: colId });
  }, [setSearchParams, searchParams, state.boards, dispatch]);

  useEffect(() => {
    localStorage.setItem("localKanban", JSON.stringify(state));
  }, [state]);

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (!over || !over.id) return;

    if (dispatch)
      dispatch({
        type: "moveToColumn",
        payload: { boardId: String(over.id), itemId: String(active.id) },
      });
  }

  return (
    <main className="flex w-full justify-center gap-3 h-10/12 mt-7 pl-7 pr-7">
      <DndContext onDragEnd={handleDragEnd}>
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
