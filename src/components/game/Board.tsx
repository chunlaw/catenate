import { Box, SxProps, Theme } from "@mui/material";
import React, { Touch, useCallback, useContext, useRef } from "react";
import BoardContext from "../../context/BoardContext";
import AppContext from "../../context/AppContext";

const Board = () => {
  const { colorPalette: COLORS, mode } = useContext(AppContext);
  const { grid, setColor, selectedColor, isSolved } = useContext(BoardContext);
  const boxRef = useRef<HTMLDivElement[]>([]);
  const pointerDown = useRef<boolean>(false);

  const handleMouseDown = useCallback(
    (i: number, j: number, color: number) => () => {
      if (isSolved && mode === "play") {
        return;
      }
      pointerDown.current = true;
      if (mode === "play") {
        selectedColor.current = color;
      } else if (selectedColor.current !== null) {
        setColor(i, j, selectedColor.current);
      }
    },
    [mode, setColor, isSolved]
  );

  const handleMouseEnter = useCallback(
    (i: number, j: number) => () => {
      if (isSolved && mode === "play") {
        return;
      }
      if (selectedColor.current !== null && pointerDown.current) {
        setColor(i, j, selectedColor.current);
      }
    },
    [setColor, mode, isSolved]
  );

  const handleActionEnd = useCallback(() => {
    pointerDown.current = false;
    if (mode === "play") {
      selectedColor.current = null;
    }
  }, [mode]);

  const getTouchingRef = useCallback(({ clientX, clientY }: Touch) => {
    for (let i = 0; i < boxRef.current.length; ++i) {
      const rect = boxRef.current[i].getBoundingClientRect();
      if (rect.left <= clientX && clientX < rect.right) {
        if (rect.top <= clientY && clientY < rect.bottom) {
          return boxRef.current[i];
        }
      }
    }
    return null;
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const box = getTouchingRef(e.touches[0]);
      if (box) {
        handleMouseDown(
          parseInt(box.dataset.x ?? "0", 8),
          parseInt(box.dataset.y ?? "0", 8),
          parseInt(box.dataset.color ?? "0", 8)
        )();
      }
    },
    [getTouchingRef, handleMouseDown]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const box = getTouchingRef(e.touches[0]);
      if (box) {
        handleMouseEnter(
          parseInt(box.dataset.x ?? "0", 8),
          parseInt(box.dataset.y ?? "0", 8)
        )();
      }
    },
    [getTouchingRef, handleMouseEnter]
  );

  return (
    <Box
      sx={boardSx}
      onMouseLeave={handleActionEnd}
      onMouseUp={handleActionEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleActionEnd}
    >
      {grid.map((row, i) => (
        <Box display="flex" key={`row-${i}`}>
          {row.map((cell, j) => (
            <Box
              ref={(el: HTMLDivElement) =>
                (boxRef.current[i * row.length + j] = el)
              }
              sx={{
                ...cellSx,
                borderLeftColor:
                  j > 0 && Math.abs(grid[i][j - 1]) === Math.abs(cell) && cell
                    ? COLORS[Math.abs(cell)]
                    : "none",
                borderRightColor:
                  j + 1 < row.length &&
                  Math.abs(grid[i][j + 1]) === Math.abs(cell) &&
                  cell
                    ? COLORS[Math.abs(cell)]
                    : "none",
                borderTopColor:
                  i > 0 && Math.abs(grid[i - 1][j]) === Math.abs(cell) && cell
                    ? COLORS[Math.abs(cell)]
                    : "none",
                borderBottomColor:
                  i + 1 < grid.length &&
                  Math.abs(grid[i + 1][j]) === Math.abs(cell) &&
                  cell
                    ? COLORS[Math.abs(cell)]
                    : "none",
              }}
              key={`cell-${i}-${j}`}
              data-color={Math.abs(cell)}
              data-x={i}
              data-y={j}
              bgcolor={COLORS[Math.abs(cell)]}
              onMouseDown={handleMouseDown(i, j, Math.abs(cell))}
              onMouseEnter={handleMouseEnter(i, j)}
            >
              {cell < 0 && <Box sx={pivotSx} />}
            </Box>
          ))}
        </Box>
      ))}
      {Array(grid.length + 1)
        .fill(0)
        .map((_, i) =>
          Array(grid[0].length + 1)
            .fill(0)
            .map((_, j) => (
              <Box
                key={`mask-${i}-${j}`}
                position="absolute"
                width={8}
                height={8}
                bgcolor="#000"
                top={i * 35 - 4}
                left={j * 35 - 4}
              />
            ))
        )}
    </Box>
  );
};

export default Board;

const boardSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  borderWidth: 4,
  borderColor: "rgba(0, 0, 0, 1)",
  borderStyle: "solid",
  bgcolor: "rgba(0, 0, 0, 1)",
  position: "relative",
  "& > *": {
    userSelect: "none !important",
  },
};

const cellSx: SxProps<Theme> = {
  width: 35,
  height: 35,
  borderWidth: 4,
  borderColor: "rgba(0, 0, 0, 1)",
  borderStyle: "solid",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const pivotSx: SxProps<Theme> = {
  height: 12,
  width: 12,
  borderWidth: 0,
  borderTopColor: "rgba(0, 0, 0, 0.5)",
  borderLeftColor: "rgba(0, 0, 0, 0.5)",
  borderStyle: "solid",
  bgcolor: "white",
  pointerEvents: "none",
};
