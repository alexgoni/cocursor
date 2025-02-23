import { createContext, useContext } from "react";

interface CoCursorContext {
  channel?: string;
  myName?: string;
  allowInfoSend: boolean;
  quality: "high" | "middle" | "low";
  disabled: boolean;
  setChannel: (channel?: string) => void;
  setMyName: (name?: string) => void;
  setAllowInfoSend: (block: boolean) => void;
  setQuality: (quality: "high" | "middle" | "low") => void;
  setDisabled: (disable: boolean) => void;
}

export const CoCursorContext = createContext<CoCursorContext | null>(null);

export function useCoCursor() {
  const context = useContext(CoCursorContext);

  if (!context) {
    throw new Error("CoCursor 컨텍스트를 호출할 수 없는 범위입니다.");
  }

  return context;
}
