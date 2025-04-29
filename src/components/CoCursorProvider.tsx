import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CoCursorContext } from "./CoCursorContext";
import { Cursor, MyCursor } from "./Cursor";
import throttle from "../utils/throttle";
import type { CursorMessage, WSMessage } from "./types";

const WS_URL = "wss://cocursor-server.store/ws";

interface Props {
  children: ReactNode;
  apiKey: string;
  channel?: string;
  myName?: string;
  allowMyCursorShare?: boolean;
  quality?: "high" | "middle" | "low";
  disabled?: boolean;
  showMyCursor?: boolean;
}

export default function CoCursorProvider({
  children,
  apiKey,
  channel: initialChannel,
  myName: initialMyName,
  allowMyCursorShare: initailAllowMyCursorShare = true,
  quality: initialQuality = "high",
  disabled: initialDisabled = false,
  showMyCursor: initialShowMyCursor = false,
}: Props) {
  const [channel, setChannel] = useState(initialChannel);
  const [myName, setMyName] = useState(initialMyName);
  const [allowMyCursorShare, setAllowMyCursorShare] = useState(
    initailAllowMyCursorShare
  );
  const [quality, setQuality] = useState<"high" | "middle" | "low">(
    initialQuality
  );
  const [cursors, setCursors] = useState<Record<string, CursorMessage>>({});
  const [disabled, setDisabled] = useState(initialDisabled);
  const [showMyCursor, setShowMyCursor] = useState(initialShowMyCursor);
  const ws = useRef<WebSocket | null>(null);
  const userId = useRef(`user-${Math.random().toString(36).substring(2, 11)}`);

  const sendCursorPosition = useCallback(
    (e: MouseEvent) => {
      if (
        !ws.current ||
        ws.current.readyState !== WebSocket.OPEN ||
        !allowMyCursorShare
      ) {
        return;
      }

      const width = document.documentElement.scrollWidth;
      const height = document.documentElement.scrollHeight;

      const cursorData: CursorMessage = {
        type: "cursor",
        id: userId.current,
        x: e.pageX / width,
        y: e.pageY / height,
        visible: true,
        name: myName || "anonymous",
      };
      ws.current?.send(JSON.stringify(cursorData));
    },
    [allowMyCursorShare, myName]
  );
  const throttleMS = (() => {
    if (quality === "high") return 0;
    if (quality === "middle") return 10;
    if (quality === "low") return 30;
    return 0;
  })();
  const throttledSendCursorPosition = throttle(sendCursorPosition, throttleMS);

  const sendCursorOff = () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      return;
    }

    const cursorData = {
      type: "cursor",
      id: userId.current,
      visible: false,
    };
    ws.current?.send(JSON.stringify(cursorData));
  };

  const reset = () => {
    sendCursorOff();
    ws.current?.close();
    ws.current = null;
  };

  // 웹소켓 연결 및 설정
  useEffect(() => {
    if (disabled) {
      reset();
      return;
    }

    let wsURL = WS_URL;
    if (channel) {
      wsURL = `${WS_URL}?channel=${channel}`;
    }

    // 웹소켓 연결
    ws.current = new WebSocket(wsURL, [apiKey]);

    ws.current.onopen = () => {
      console.log("CoCursor: Connected to the WebSocket server.");
    };

    // 웹소켓 메시지 수신
    ws.current.onmessage = (event) => {
      const data: WSMessage = JSON.parse(event.data);

      if (data.type === "cursor") {
        setCursors((prev) => ({ ...prev, [data.id]: data }));
      }

      if (data.type === "error") {
        console.error(`CoCursor: ${data.message}`);
      }
    };

    ws.current.onclose = () => {
      reset();
      console.log("CoCursor: Disconnected from the WebSocket server.");
    };

    return () => {
      // 웹소켓 연결 종료
      reset();
    };
  }, [channel, disabled]);

  // 마우스 움직임에 따른 메시지 송신
  useEffect(() => {
    if (disabled) {
      return;
    }

    window.addEventListener("mousemove", throttledSendCursorPosition);
    document.addEventListener("mouseleave", sendCursorOff);
    window.addEventListener("beforeunload", reset);

    return () => {
      window.removeEventListener("mousemove", throttledSendCursorPosition);
      document.removeEventListener("mouseleave", sendCursorOff);
      window.removeEventListener("beforeunload", reset);
    };
  }, [throttledSendCursorPosition, disabled]);

  // 정보 송신 거부 시 커서 삭제
  useEffect(() => {
    if (!allowMyCursorShare) {
      sendCursorOff();
    }
  }, [allowMyCursorShare]);

  // Prop가 변경될 때 상태 업데이트
  useEffect(() => {
    setChannel(initialChannel);
  }, [initialChannel]);
  useEffect(() => {
    setMyName(initialMyName);
  }, [initialMyName]);
  useEffect(() => {
    setAllowMyCursorShare(initailAllowMyCursorShare);
  }, [initailAllowMyCursorShare]);
  useEffect(() => {
    setQuality(initialQuality);
  }, [initialQuality]);
  useEffect(() => {
    setDisabled(initialDisabled);
  }, [initialDisabled]);
  useEffect(() => {
    setShowMyCursor(initialShowMyCursor);
  }, [initialShowMyCursor]);

  return (
    <CoCursorContext.Provider
      value={{
        channel,
        myName,
        allowMyCursorShare,
        quality,
        disabled,
        showMyCursor,
        setChannel,
        setMyName,
        setAllowMyCursorShare,
        setQuality,
        setDisabled,
        setShowMyCursor,
      }}
    >
      {!disabled && (
        <>
          {Object.values(cursors).map((cursorData) => (
            <Cursor key={cursorData.id} data={cursorData} />
          ))}
          {showMyCursor && <MyCursor myName={myName || "anonymous"} />}
        </>
      )}
      {children}
    </CoCursorContext.Provider>
  );
}
