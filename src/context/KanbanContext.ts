import { createContext } from "react";
import type { Kanban } from "../types/types";
import type { Actiontype } from "../types/types";

export const KanbanContext = createContext<Kanban | null>(null);
export const KanbanDispatchContext =
  createContext<React.Dispatch<Actiontype> | null>(null);
