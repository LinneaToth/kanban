import { createContext } from "react";
import type { Kanban } from "../types/types";
import type { ACTIONTYPE } from "../reducer/kanbanReducer.ts";

export const KanbanContext = createContext<Kanban | null>(null);
export const KanbanDispatchContext =
  createContext<React.Dispatch<ACTIONTYPE> | null>(null);
