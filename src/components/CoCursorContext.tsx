import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
} from "react";

interface CoCursorContext {
  channel?: string;
  myName?: string;
  allowMyCursorShare: boolean;
  quality: "high" | "middle" | "low";
  disabled: boolean;
  showMyCursor?: boolean;
  setChannel: Dispatch<SetStateAction<string | undefined>>;
  setMyName: Dispatch<SetStateAction<string | undefined>>;
  setAllowMyCursorShare: Dispatch<SetStateAction<boolean>>;
  setQuality: Dispatch<SetStateAction<"high" | "middle" | "low">>;
  setDisabled: Dispatch<SetStateAction<boolean>>;
  setShowMyCursor: Dispatch<SetStateAction<boolean>>;
}

export const CoCursorContext = createContext<CoCursorContext | null>(null);

export function useCoCursor() {
  const context = useContext(CoCursorContext);

  if (!context) {
    throw new Error("CoCursor 컨텍스트를 호출할 수 없는 범위입니다.");
  }

  return context;
}
