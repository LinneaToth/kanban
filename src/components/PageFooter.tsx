import { useContext } from "react";
import { KanbanDispatchContext } from "../context/KanbanContext";

export default function Footer() {
  const dispatch = useContext(KanbanDispatchContext);

  return (
    <footer>
      {" "}
      <button onClick={() => dispatch({ type: "clearBoard" })}>CLEAR</button>
    </footer>
  );
}
