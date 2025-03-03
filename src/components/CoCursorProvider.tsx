"use client";

import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { CoCursorContext } from "./CoCursorContext";
import Cursor from "./Cursor";
import throttle from "../utils/throttle";
import type { CursorMessage, WSMessage } from "./types";

const WS_URL = "ws://15.165.148.251:8080";

interface Props {
  children: ReactNode;
  apiKey: string;
  channel?: string;
  myName?: string;
  allowInfoSend?: boolean;
  quality?: "high" | "middle" | "low";
  disabled?: boolean;
}

export default function CoCursorProvider({
  children,
  apiKey,
  channel: initialChannel,
  myName: initialMyName,
  allowInfoSend: initialAllowInfoSend = true,
  quality: initialQuality = "high",
  disabled: initialDisabled = false,
}: Props) {
  const [channel, setChannel] = useState(initialChannel);
  const [myName, setMyName] = useState(initialMyName);
  const [allowInfoSend, setAllowInfoSend] = useState(initialAllowInfoSend);
  const [quality, setQuality] = useState<"high" | "middle" | "low">(
    initialQuality
  );
  const [cursors, setCursors] = useState<Record<string, CursorMessage>>({});
  const [disabled, setDisabled] = useState(initialDisabled);
  const ws = useRef<WebSocket | null>(null);
  const userId = useRef(`user-${Math.random().toString(36).substring(2, 11)}`);

  const sendCursorPosition = useCallback(
    (e: MouseEvent) => {
      if (
        !ws.current ||
        ws.current.readyState !== WebSocket.OPEN ||
        !allowInfoSend
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
    [allowInfoSend, myName]
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
      id: userId.current,
      visible: false,
    };
    ws.current?.send(JSON.stringify(cursorData));
  };

  // 웹소켓 연결 및 설정
  useEffect(() => {
    if (disabled) {
      sendCursorOff();
      ws.current?.close();
      ws.current = null;
      return;
    }

    let wsURL = WS_URL;
    if (channel) {
      wsURL = `${WS_URL}?channel=${channel}`;
    }

    // 웹소켓 연결
    ws.current = new WebSocket(wsURL, [apiKey]);

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

    return () => {
      // 웹소켓 연결 종료
      sendCursorOff();
      ws.current?.close();
      ws.current = null;
    };
  }, [channel, disabled]);

  // 마우스 움직임에 따른 메시지 송신
  useEffect(() => {
    if (disabled) {
      return;
    }

    window.addEventListener("mousemove", throttledSendCursorPosition);
    document.addEventListener("mouseleave", sendCursorOff);

    return () => {
      window.removeEventListener("mousemove", throttledSendCursorPosition);
      document.removeEventListener("mouseleave", sendCursorOff);
    };
  }, [throttledSendCursorPosition, disabled]);

  // 정보 송신 거부 시 커서 삭제
  useEffect(() => {
    if (!allowInfoSend) {
      sendCursorOff();
    }
  }, [allowInfoSend]);

  return (
    <CoCursorContext.Provider
      value={{
        channel,
        setChannel,
        myName,
        setMyName,
        allowInfoSend,
        setAllowInfoSend,
        quality,
        setQuality,
        disabled,
        setDisabled,
      }}
    >
      {!disabled &&
        Object.values(cursors).map((cursorData) => (
          <Cursor key={cursorData.id} data={cursorData} />
        ))}
      {children}
    </CoCursorContext.Provider>
  );
}
