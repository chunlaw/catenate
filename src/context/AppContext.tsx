import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BoardContext from "./BoardContext";

interface AppContextState {
  mode: "play" | "create";
  colorPalette: string[];
  errorMsg: string;
  problemIdx: number;
  problems: Problem[];
}

interface AppContextValue extends AppContextState {
  availableProblems: Problem[];
  problemNameMap: Record<string, number>;
  setColor: (color: string, idx: number) => void;
  toggleMode: () => void;
  createNewBoard: () => void;
  gotoProblem: (uuid: string) => void;
  setErrorMsg: (msg: string) => void;
  saveProblem: (grid: number[][]) => void;
  prevProblem: () => void;
  nextProblem: () => void;
}

const AppContext = React.createContext({} as AppContextValue);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppContextState>(DEFAULT_STATE);
  const { setGrid, isSolved } = useContext(BoardContext);
  const problemIdxRef = useRef<number>(-2);

  const availableProblems = useMemo(() => {
    const problems: Problem[] = [];
    let i = 0;
    do {
      problems.push(state.problems[i++]);
      if (!problems[problems.length - 1].clean) {
        break;
      }
    } while (i < state.problems.length);
    return problems.reverse();
  }, [state.problems]);

  const problemNameMap = useMemo(
    () =>
      state.problems.reduce(
        (acc, { uuid }, idx) => {
          acc[uuid] = idx + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
    [state.problems]
  );

  const setColor = useCallback((color: string, idx: number) => {
    setState((prev) => {
      const palette = [...prev.colorPalette];
      palette[idx] = color;
      return {
        ...prev,
        colorPalette: palette,
      };
    });
  }, []);

  const toggleMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      mode: prev.mode === "play" ? "create" : "play",
      problemIdx: prev.mode === "create" ? availableProblems.length - 1 : -1,
    }));
  }, [availableProblems]);

  useEffect(() => {
    localStorage.setItem("colorPalette", JSON.stringify(state.colorPalette));
  }, [state.colorPalette]);

  useEffect(() => {
    localStorage.setItem("problems", JSON.stringify(state.problems));
  }, [state.problems]);

  useEffect(() => {
    localStorage.setItem("problemIdx", JSON.stringify(state.problemIdx));
  }, [state.problemIdx]);

  useEffect(() => {
    if (state.problemIdx !== -1 && state.problemIdx !== problemIdxRef.current) {
      setGrid(state.problems[state.problemIdx].grid);
    }
    problemIdxRef.current = state.problemIdx;
  }, [setGrid, state.problems, state.problemIdx]);

  useEffect(() => {
    setState((prev) => {
      if (state.mode === "play" && isSolved) {
        const problems = JSON.parse(JSON.stringify(state.problems));
        problems[prev.problemIdx].clean = true;
        return {
          ...prev,
          problems,
        };
      }
      return prev;
    });
  }, [state.mode, isSolved]);

  const createNewBoard = useCallback(() => {
    const grid: number[][] = [];
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const row = (buf[0] % 10) + 1;
    const col = (Math.floor(buf[0] / 10) % 10) + 1;
    for (let i = 0; i < row; ++i) {
      grid[i] = [];
      for (let j = 0; j < col; ++j) {
        grid[i][j] = 0;
      }
    }
    setGrid(grid);
    setState((prev) => ({
      ...prev,
      problemIdx: -1,
    }));
  }, [setGrid]);

  const setErrorMsg = useCallback((msg: string) => {
    setState((prev) => ({
      ...prev,
      errorMsg: msg,
    }));
  }, []);

  const saveProblem = useCallback((grid: number[][]) => {
    setState((prev) => {
      const problems: Problem[] = JSON.parse(JSON.stringify(prev.problems));
      if (prev.problemIdx === -1) {
        problems.push({
          uuid: crypto.randomUUID(),
          grid: JSON.parse(JSON.stringify(grid)),
          clean: false,
        });
      } else {
        problems[prev.problemIdx].grid = JSON.parse(JSON.stringify(grid));
        problems[prev.problemIdx].clean = false;
      }

      return {
        ...prev,
        problems,
        problemIdx:
          prev.problemIdx === -1 ? problems.length - 1 : prev.problemIdx,
      };
    });
  }, []);

  const gotoProblem = useCallback(
    (uuid: string) => {
      setState((prev) => {
        const problemIdx = prev.problems.map(({ uuid }) => uuid).indexOf(uuid);
        if (problemIdx === -1) return prev;
        return {
          ...prev,
          problemIdx,
        };
      });
    },
    [state.problems]
  );

  const prevProblem = useCallback(() => {
    setState((prev) => ({
      ...prev,
      problemIdx: Math.max(prev.problemIdx - 1, 0),
    }));
  }, []);

  const nextProblem = useCallback(() => {
    setState((prev) => ({
      ...prev,
      problemIdx: Math.min(prev.problemIdx + 1, prev.problems.length - 1),
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        availableProblems,
        problemNameMap,
        setColor,
        toggleMode,
        createNewBoard,
        setErrorMsg,
        saveProblem,
        gotoProblem,
        prevProblem,
        nextProblem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

export const DEFAULT_COLORS = [
  "gray",
  "#f44336",
  "#00bcd4",
  "#ff9800",
  "#673ab7",
  "#8bc34a",
  "#607d8b",
  "#03a9f4",
  "#ffc107",
  "#9c27b0",
  "#4caf50",
  "#795548",
  "#2196f3",
  "#ffeb3b",
  "#e81e63",
  "#009688",
  "#ff5722",
  "#3f51b5",
  "#cddc39",
];

const DEFAULT_STATE: AppContextState = {
  mode: "play",
  colorPalette: JSON.parse(
    localStorage.getItem("colorPalette") ?? JSON.stringify(DEFAULT_COLORS)
  ),
  errorMsg: "",
  problemIdx: parseInt(localStorage.getItem("problemIdx") ?? "0", 10),
  problems: JSON.parse(
    localStorage.getItem("problems") ??
      JSON.stringify([
        {
          uuid: "ba1ec5da-10cc-4d83-af8f-a94039c10efa",
          grid: [
            [1, 0, 0, 0, 0].map((v) => -v),
            [0, 0, 0, 0, 0].map((v) => -v),
            [2, 3, 4, 0, 0].map((v) => -v),
            [0, 0, 0, 0, 0].map((v) => -v),
            [0, 4, 0, 0, 0].map((v) => -v),
            [0, 3, 2, 0, 1].map((v) => -v),
          ],
          clean: false,
        },
      ] as Problem[])
  ),
};
