import React, {
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { getSolvable, solveGrid } from "../solver";

interface BoardContextState {
  grid: number[][];
  _grid: number[][];
}

interface BoardContextValue extends BoardContextState {
  selectedColor: React.MutableRefObject<number | null>;
  isSolved: boolean;
  setGrid: (grid: number[][]) => void;
  setColor: (x: number, y: number, color: number) => void;
  solve: () => void;
  resetGame: () => void;
  emptyGrid: () => void;
  changeRowNumber: (v: "+" | "-") => void;
  changeColNumber: (v: "+" | "-") => void;
}

const BoardContext = React.createContext({} as BoardContextValue);

export const BoardContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<BoardContextState>(DEFAULT_STATE);
  const selectedColor = useRef<number | null>(null);

  const isSolved = useMemo(() => {
    try {
      // solved if there is no error thrown
      getSolvable(state.grid);
      return true;
    } catch {}
    return false;
  }, [state.grid]);

  const setGrid = useCallback((grid: number[][]) => {
    setState((prev) => ({
      ...prev,
      grid: JSON.parse(JSON.stringify(grid)),
      _grid: JSON.parse(JSON.stringify(grid)),
    }));
  }, []);

  const setColor = useCallback((x: number, y: number, color: number) => {
    setState((prev) => {
      if (prev.grid[x][y] === color) {
        return prev;
      }
      const grid = JSON.parse(JSON.stringify(prev.grid));
      if (grid[x][y] >= 0) grid[x][y] = color;
      return {
        ...prev,
        grid,
      };
    });
  }, []);

  const solve = useCallback(() => {
    setState((prev) => ({
      ...prev,
      grid: solveGrid(JSON.parse(JSON.stringify(state.grid))) as number[][],
    }));
  }, [state.grid]);

  const resetGame = useCallback(() => {
    setState((prev) => ({
      ...prev,
      grid: JSON.parse(JSON.stringify(prev._grid)),
    }));
  }, []);

  const emptyGrid = useCallback(() => {
    setState((prev) => {
      const _grid = JSON.parse(JSON.stringify(prev.grid));
      for (let i = 0; i < _grid.length; ++i) {
        for (let j = 0; j < _grid[i].length; ++j) {
          _grid[i][j] = 0;
        }
      }
      return {
        ...prev,
        grid: _grid,
      };
    });
  }, []);

  const changeRowNumber = useCallback((v: "+" | "-") => {
    setState((prev) => {
      const row = prev.grid.length;
      const col = prev.grid[0].length;
      const _grid = JSON.parse(JSON.stringify(prev.grid));
      if (row > 1 && v === "-") {
        _grid.length = _grid.length - 1;
      }
      if (row < 9 && v === "+") {
        _grid.push(Array(col).fill(0));
      }
      return {
        ...prev,
        grid: _grid,
      };
    });
  }, []);

  const changeColNumber = useCallback((v: "+" | "-") => {
    setState((prev) => {
      const row = prev.grid.length;
      const col = prev.grid[0].length;
      const _grid = JSON.parse(JSON.stringify(prev.grid));
      if (col > 1 && v === "-") {
        for (let i = 0; i < row; ++i) {
          _grid[i].length = col - 1;
        }
      }
      if (col < 9 && v === "+") {
        for (let i = 0; i < row; ++i) {
          _grid[i].push(0);
        }
      }
      return {
        ...prev,
        grid: _grid,
      };
    });
  }, []);

  return (
    <BoardContext.Provider
      value={{
        ...state,
        selectedColor,
        isSolved,
        setGrid,
        setColor,
        solve,
        resetGame,
        emptyGrid,
        changeRowNumber,
        changeColNumber,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export default BoardContext;

const DEFAULT_STATE: BoardContextState = {
  grid: [[]],
  _grid: [[]],
};
