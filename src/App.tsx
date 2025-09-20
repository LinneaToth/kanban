import { useReducer, useEffect } from "react";

//Project specific imports
import { KanbanContext, KanbanDispatchContext } from "./context/KanbanContext";
import { kanbanReducer } from "./reducer/kanbanReducer";
import type { Kanban } from "./types/types";
import KanbanBoard from "./components/KanbanBoard";
import PageHeader from "./components/PageHeader.tsx";
import { initialState } from "./reducer/InitialState.ts";

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
