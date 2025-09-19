import type { Kanban } from "../types/types";

export const initialState: Kanban = {
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
