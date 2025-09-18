import { useReducer, useEffect } from "react";
import { KanbanContext, KanbanDispatchContext } from "./context/KanbanContext";
import { kanbanReducer } from "./reducer/kanbanReducer";
import type { Kanban } from "./types/types";
import KanbanBoard from "./components/KanbanBoard";
import PageHeader from "./components/PageHeader.tsx";

const initialState: Kanban = {
  boards: [
    { id: "00", title: "Todo" },
    { id: "01", title: "Doing" },
    { id: "02", title: "Done" },
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

  useEffect(() => {
    localStorage.setItem("localKanban", JSON.stringify(state));
  }, [state]);

  return (
    <>
      <KanbanContext.Provider value={state}>
        <KanbanDispatchContext.Provider value={dispatch}>
          <PageHeader />
          <KanbanBoard />
        </KanbanDispatchContext.Provider>
      </KanbanContext.Provider>
    </>
  );
}

export default App;
