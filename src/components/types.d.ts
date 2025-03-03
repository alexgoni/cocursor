export interface CursorMessage {
  type: "cursor";
  id: string;
  x: number;
  y: number;
  visible: boolean;
  name: string;
}

export interface ErrorMessage {
  type: "error";
  message: string;
}

export type WSMessage = CursorMessage | ErrorMessage;
