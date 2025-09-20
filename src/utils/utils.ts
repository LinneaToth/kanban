import type { Kanban } from "../types/types";

export const computeVisibleColumns = (state: Kanban): string[] => {
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
};
