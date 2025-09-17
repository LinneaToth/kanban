export type Item = {
  title: string;
  id: string;
  description: string;
  parent: string;
  archived: boolean;
  date: string;
};

export type Column = {
  title: string;
  id: string;
};

export type Kanban = {
  boards: Column[];
  items: Item[];
  layout: {
    baseShowing: boolean;
    optionalCol: string | null;
  };
};
