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
import { Problem } from "../type";

interface AppContextState {
  init: boolean;
  mode: "play" | "create";
  colorPalette: string[];
  isCopied: boolean;
  errorMsg: string;
  problemIdx: number;
  problems: Problem[];
}

interface AppContextValue extends AppContextState {
  availableProblems: Problem[];
  availableExtraProblems: Problem[];
  problemNameMap: Record<string, number>;
  setColor: (color: string, idx: number) => void;
  toggleMode: () => void;
  createNewBoard: () => void;
  gotoProblem: (uuid: string) => void;
  setErrorMsg: (msg: string) => void;
  setCopied: (isCopied: boolean) => void;
  saveProblem: (grid: number[][]) => void;
  loadProblem: (base64: string) => void;
  prevProblem: () => void;
  nextProblem: () => void;
  shareProblem: (uuid: string) => Promise<void>;
}

const AppContext = React.createContext({} as AppContextValue);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppContextState>(DEFAULT_STATE);
  const { setGrid, isSolved, grid } = useContext(BoardContext);
  const problemIdxRef = useRef<number>(-2);

  const availableProblems = useMemo(() => {
    const _problems = state.problems.filter(({ extra }) => !extra);
    if (_problems.length === 0) return [];
    const problems: Problem[] = [];
    let i = 0;
    do {
      if (_problems[i].extra) {
        i++;
      }
      problems.push(_problems[i++]);
      if (!problems[problems.length - 1].clean) {
        break;
      }
    } while (i < _problems.length);
    return problems.reverse();
  }, [state.problems]);

  const availableExtraProblems = useMemo(() => {
    return state.problems.filter(({ extra }) => extra).reverse();
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
    if (
      state.problems.length &&
      state.problemIdx !== -1 &&
      state.problemIdx !== problemIdxRef.current
    ) {
      setGrid(state.problems[state.problemIdx].grid);
    }
    problemIdxRef.current = state.problemIdx;
  }, [setGrid, state.problems, state.problemIdx]);

  useEffect(() => {
    setState((prev) => {
      if (state.mode === "play" && isSolved) {
        const problems = JSON.parse(JSON.stringify(state.problems));
        problems[prev.problemIdx].clean = true;
        problems[prev.problemIdx].solution = JSON.parse(JSON.stringify(grid));
        return {
          ...prev,
          problems,
        };
      }
      return prev;
    });
  }, [state.mode, isSolved, grid]);

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

  const setCopied = useCallback((isCopied: boolean) => {
    setState((prev) => ({
      ...prev,
      isCopied,
    }));
  }, []);

  const saveProblem = useCallback((grid: number[][]) => {
    setState((prev) => {
      const problems: Problem[] = JSON.parse(JSON.stringify(prev.problems));
      let nextProblemIdx = 0;
      if (prev.problemIdx === -1 || !problems[prev.problemIdx].extra) {
        problems.push({
          uuid: crypto.randomUUID(),
          grid: JSON.parse(JSON.stringify(grid)),
          clean: false,
          extra: true,
        });
        nextProblemIdx = problems.length - 1;
      } else {
        problems[prev.problemIdx].grid = JSON.parse(JSON.stringify(grid));
        problems[prev.problemIdx].clean = false;
        nextProblemIdx = prev.problemIdx;
      }

      return {
        ...prev,
        problems,
        problemIdx: nextProblemIdx,
      };
    });
  }, []);

  const loadProblem = useCallback((base64: string) => {
    if (base64) {
      const { uuid, grid } = JSON.parse(atob(base64));
      if (
        Array.isArray(grid) &&
        grid.length &&
        Array.isArray(grid[0]) &&
        typeof uuid === "string"
      ) {
        setState((prev) => {
          const problems: Problem[] = JSON.parse(JSON.stringify(prev.problems));
          let problemIdx: number = problems
            .map(({ uuid }) => uuid)
            .indexOf(uuid);
          if (problemIdx === -1) {
            problems.push({ uuid, grid, extra: true });
            problemIdx = problems.length - 1;
          } else if (
            JSON.stringify(problems[problemIdx].grid) === JSON.stringify(grid)
          ) {
            return prev;
          } else {
            problems[problemIdx].grid = grid;
          }
          return {
            ...prev,
            problems,
            problemIdx,
          };
        });
        return;
      }
    }
    throw new Error("Load error");
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

  useEffect(() => {
    if (!state.init) {
      problemIdxRef.current = -1;
      fetch("/problems.json")
        .then((r) => r.json())
        .then((problems: Problem[]) => {
          setState((prev) => {
            const savedProblems = prev.problems.reduce(
              (acc, problem) => {
                acc[problem.uuid] = problem;
                return acc;
              },
              {} as Record<string, Problem>
            );
            return {
              ...prev,
              init: true,
              problems: problems.map((problem) => {
                if (savedProblems[problem.uuid]) {
                  return savedProblems[problem.uuid];
                }
                return problem;
              }),
            };
          });
        })
        .catch(() => {});
    }
  }, [state.problems, state.init]);

  const shareProblem = useCallback(
    (uuid: string) => {
      const base64: string = state.problems.reduce((acc, cur) => {
        if (uuid === cur.uuid) return btoa(JSON.stringify(cur));
        return acc;
      }, "");
      if (base64) {
        const title = "Try out my grid in Catenate";
        const url = `https://catenate.chunlaw.io/diy/${base64}`;
        if (navigator.share) {
          return navigator.share({
            title,
            url: `https://catenate.chunlaw.io/diy/${base64}`,
          });
        } else if (navigator.clipboard) {
          return navigator.clipboard.writeText(url).then(() => setCopied(true));
        }
      }
      return Promise.resolve();
    },
    [state.problems]
  );

  if (state.problems.length === 0) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        availableProblems,
        availableExtraProblems,
        problemNameMap,
        setColor,
        toggleMode,
        createNewBoard,
        setErrorMsg,
        setCopied,
        saveProblem,
        loadProblem,
        gotoProblem,
        prevProblem,
        nextProblem,
        shareProblem,
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
  init: false,
  mode: "play",
  colorPalette: JSON.parse(
    localStorage.getItem("colorPalette") ?? JSON.stringify(DEFAULT_COLORS)
  ),
  isCopied: false,
  errorMsg: "",
  problemIdx: parseInt(localStorage.getItem("problemIdx") ?? "0", 10),
  problems: JSON.parse(localStorage.getItem("problems") ?? "[]"),
};
