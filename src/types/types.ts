export type Kanban = {
  boards: Column[];
  items: Item[];
  layout: {
    baseShowing: boolean;
    optionalCol: string;
  };
};

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

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

//For the reducer:
export type Actiontype =
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
  | { type: "editCol"; payload: { title: string; id: string } }
  | { type: "clearBoard" }
  | { type: "resetLayout" }
  | { type: "deleteCol"; payload: string };

export type ModalContentProps = {
  onClose: () => void;
  showModal: boolean;
  children: React.ReactNode;
};

export type KanbanItemProps = {
  itemId: string;
};

export type KanbanColumnProps = {
  id: string;
  children: React.ReactNode;
  title: string;
};

export type CreateColumnProps = {
  setShowModal: (input: boolean) => void;
  setExpanded: (input: boolean) => void;
};

//INPUT PROPS
// Shared input props
export type BaseProps = {
  name: string;
  labelText: string;
};

// text input
export type TextInputProps = BaseProps & {
  type: "text";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

// textarea input
export type TextareaProps = BaseProps & {
  type: "textarea";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

// select input
export type SelectProps = BaseProps & {
  type: "select";
  value: string; // parent or selected column id
  options: Column[]; // all columns
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export type InputProps = TextInputProps | TextareaProps | SelectProps;
