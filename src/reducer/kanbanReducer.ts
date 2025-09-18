import type { Kanban, Item } from "../types/types.ts";
import { v4 as uuidv4 } from "uuid";

export type ACTIONTYPE =
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
  | { type: "showBaseCols"; payload: boolean }
  | { type: "addOptionalCol"; payload: { title: string; id: string } }
  | { type: "clearBoard" }
  | { type: "resetLayout" }
  | { type: "deleteCol"; payload: string };

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

    case "addOptionalCol": {
      const newColumns = [...state.boards];
      const newCol = {
        title: action.payload.title || "Untitled",
        id: action.payload.id,
      };

      newColumns.push(newCol);
      return {
        ...state,
        boards: newColumns,
        layout: {
          baseShowing: state.layout.baseShowing,
          optionalCol: newCol.id,
        },
      };
    }

    case "deleteCol": {
      const newItems = state.items.filter(
        (item) => item.parent !== action.payload
      );

      return {
        ...state,
        boards: state.boards.filter((col) => col.id !== action.payload),
        items: newItems,
      };
    }

    case "resetLayout": {
      return {
        ...state,
        layout: {
          baseShowing: true,
          optionalCol: "",
        },
      };
    }

    case "clearBoard": {
      return {
        boards: [
          { id: "00", title: "Todo" },
          { id: "01", title: "Doing" },
          { id: "02", title: "Done" },
        ],
        items: [],
        layout: {
          baseShowing: true,
          optionalCol: "",
        },
      };
    }

    default:
      throw new Error();
  }
}
