export type Item = {
  title: string;
  id: string;
  description: string;
  parent: string;
  archived: boolean;
};

export type Column = {
  title: string;
  id: string;
  visible: boolean;
};

export type Kanban = {
  boards: Column[];
  items: Item[];
};
