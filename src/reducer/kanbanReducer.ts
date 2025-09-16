import type { Kanban, Item } from "../types/types.ts";
import { v4 as uuidv4 } from "uuid";

type ACTIONTYPE =
  | { type: "moveToColumn"; payload: { boardId: string; itemId: string } }
  | {
      type: "newItem";
      payload: { title: string; description: string; parent: string };
    }
  | {
      type: "deleteItem";
      payload: { id: string };
    }
  | {
      type: "updateItem";
      payload: Item;
    }
  | { type: "showOptionalCol"; payload: string }
  | { type: "showBaseCols"; payload: boolean };

export function kanbanReducer(state: Kanban, action: ACTIONTYPE) {
  switch (action.type) {
    case "moveToColumn": {
      const { itemId, boardId } = action.payload;

      localStorage.setItem(
        "localKanban",
        JSON.stringify({
          ...state,
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, parent: boardId } : item
          ),
        })
      );

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, parent: boardId } : item
        ),
      };
    }
    case "newItem": {
      const id: string = "item-" + uuidv4().slice(0, 8);

      const newItem: Item = {
        id: id,
        title: action.payload.title === "" ? "No Title" : action.payload.title,
        description: action.payload.description,
        parent: action.payload.parent,
        archived: false,
        date: new Date().toLocaleDateString(),
      };
      const updatedItems = [...state.items, newItem];
      localStorage.setItem(
        "localKanban",
        JSON.stringify({ ...state, items: updatedItems })
      );
      return { ...state, items: updatedItems };
    }

    case "deleteItem": {
      const newItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );
      localStorage.setItem(
        "localKanban",
        JSON.stringify({ ...state, items: newItems })
      );
      return { ...state, items: newItems };
    }

    case "updateItem": {
      const newItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );
      newItems.push(action.payload);

      localStorage.setItem(
        "localKanban",
        JSON.stringify({ ...state, items: newItems })
      );
      return { ...state, items: newItems };
    }
    case "showOptionalCol": {
      return {
        ...state,
        layout: {
          optionalCol: action.payload,
          baseShowing: state.layout.baseShowing,
        },
      };
    }

    case "showBaseCols": {
      return {
        ...state,
        layout: {
          optionalCol: state.layout.optionalCol,
          baseShowing: action.payload,
        },
      };
    }

    default:
      throw new Error();
  }
}
