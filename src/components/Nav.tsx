import { useContext, useState } from "react";
import { KanbanDispatchContext } from "../context/KanbanContext";
import { KanbanContext } from "../context/KanbanContext";

export default function Nav() {
  const [expanded, setExpanded] = useState(false);
  const state = useContext(KanbanContext);
  const dispatch = useContext(KanbanDispatchContext);

  const toggleExpand = () => {
    setExpanded((expanded) => !expanded);
  };

  return (
    <>
      <button onClick={toggleExpand}>Expand</button>

      {expanded ? (
        <ul>
          <li>Show Optional Board:</li>
          {state.boards.map((board) => (
            <li>{board.title}</li>
          ))}
        </ul>
      ) : (
        ""
      )}
    </>
  );
}
