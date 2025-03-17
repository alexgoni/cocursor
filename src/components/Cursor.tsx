import React, { memo, useEffect, useMemo, useState } from "react";
import stringToColor from "../utils/stringToColor";
import type { CursorMessage } from "./types";
import "../styles/cursor.css";

export const Cursor = memo(({ data }: { data: CursorMessage }) => {
  const { x, y, name, visible, id } = data;
  const color = useMemo(() => stringToColor(id), [id]);

  if (!visible || x === undefined || y === undefined) return null;

  const width = document.documentElement.scrollWidth;
  const height = document.documentElement.scrollHeight;

  return (
    <div
      style={{
        top: y * height - window.scrollY,
        left: x * width - window.scrollX,
      }}
      className="cocursor__cursor-wrapper"
    >
      <Arrow color={color} />
      <div
        style={{
          backgroundColor: color,
        }}
        className="cocursor__label"
      >
        {name}
      </div>
    </div>
  );
});

export const MyCursor = memo(({ myName }: { myName: string }) => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>({
    x: 0,
    y: 0,
  });
  const [randomSeed] = useState(() =>
    Math.random().toString(36).substring(2, 5)
  );
  const color = stringToColor(myName + randomSeed);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
      setPosition(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!position) return null;

  return (
    <div
      style={{
        top: position.y,
        left: position.x,
      }}
      className="cocursor__cursor-wrapper"
    >
      <Arrow color={color} />
      <div
        style={{
          backgroundColor: color,
        }}
        className="cocursor__label"
      >
        {myName}
      </div>
    </div>
  );
});

function Arrow({ color }: { color: string }) {
  return (
    <svg
      className="cocursor__arrow"
      viewBox="0 0 96 104"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.86065 0.697766L95.7812 51.5907L50.3553 59.6832L34.4976 103.014L0.86065 0.697766Z"
        fill={color}
      />
    </svg>
  );
}
