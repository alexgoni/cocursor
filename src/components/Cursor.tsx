import React, { memo, useMemo } from "react";

import type { CursorData } from "./CoCursorProvider";
import "./cursor.css";
import stringToColor from "../utils/stringToColor";

function Cursor({ data }: { data: CursorData }) {
  const { x, y, name, visible, id } = data;
  const color = useMemo(() => stringToColor(id), [id]);

  if (!visible) return null;

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
}

export default memo(Cursor);

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
