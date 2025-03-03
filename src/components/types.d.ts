export interface CursorMessage {
  type: "cursor";
  id: string;
  visible: boolean;
  x?: number;
  y?: number;
  name?: string;
}

export interface ErrorMessage {
  type: "error";
  message: string;
}

export type WSMessage = CursorMessage | ErrorMessage;
