import React, { memo, useMemo } from "react";
import stringToColor from "../utils/stringToColor";
import type { CursorData } from "./CoCursorProvider";
import "../styles/cursor.css";

function Cursor({ data }: { data: CursorData }) {
  const { x, y, name, visible, id } = data;
  const color = useMemo(() => stringToColor(id), [id]);

  if (!visible) return null;

  return (
    <div
      style={{
        top: y,
        left: x,
      }}
      className="cursor-wrapper"
    >
      <Arrow color={color} />
      <div
        style={{
          backgroundColor: color,
        }}
        className="label"
      >
        {name}
      </div>
    </div>
  );
}

export default memo(Cursor);

function Arrow({ color }: { color: string }) {
  return (
    <svg
      className="arrow"
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
