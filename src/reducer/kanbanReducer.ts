import type { Kanban, Item } from "../types/types.ts";

type ACTIONTYPE =
  | { type: "moveToColumn"; payload: { boardId: string; itemId: string } }
  | {
      type: "newItem";
      payload: { title: string; description: string; parent: string };
    }
  | {
      type: "deleteItem";
      payload: { id: string };
    };

export function kanbanReducer(state: Kanban, action: ACTIONTYPE) {
  switch (action.type) {
    case "moveToColumn": {
      const { itemId, boardId } = action.payload;
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, parent: boardId } : item
        ),
      };
    }
    case "newItem": {
      const newItem: Item = {
        id: "it-id" + state.items.length,
        title: action.payload.title === "" ? "No Title" : action.payload.title,
        description: action.payload.description,
        parent: action.payload.parent,
        archived: false,
      };
      const updatedItems = [...state.items, newItem];
      return { ...state, items: updatedItems };
    }

    case "deleteItem": {
      const newItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );
      return { ...state, items: newItems };
    }

    case "updateItem": {
      const newItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );
      newItems.push(action.payload);
      return { ...state, items: newItems };
    }

    default:
      throw new Error();
  }
}
