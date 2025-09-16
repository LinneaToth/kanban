import { useReducer } from "react";
import { KanbanContext, KanbanDispatchContext } from "./context/KanbanContext";
import { kanbanReducer } from "./reducer/kanbanReducer";
import type { Kanban } from "./types/types";
import KanbanBoard from "./components/KanbanBoard";
import PageHeader from "./components/PageHeader";

const initialState: Kanban = {
  boards: [
    { id: "00", title: "Todo", visible: true },
    { id: "01", title: "Doing", visible: true },
    { id: "02", title: "Done", visible: true },
  ],
  items: [],
  layout: {
    baseShowing: true,
    optionalCol: null,
  },
};

function App() {
  const localStorageKanban: string | null = localStorage.getItem("localKanban");
  const savedKanban: Kanban | null = localStorageKanban
    ? JSON.parse(localStorageKanban)
    : null;

  const [state, dispatch] = useReducer(
    kanbanReducer,
    savedKanban ? savedKanban : initialState
  );

  return (
    <>
      <KanbanContext value={state}>
        <KanbanDispatchContext value={dispatch}>
          <PageHeader />
          <KanbanBoard />
        </KanbanDispatchContext>
      </KanbanContext>
    </>
  );
}

export default App;
