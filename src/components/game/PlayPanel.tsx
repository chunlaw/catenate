import { Box, Button, Fab } from "@mui/material";
import { useCallback, useContext, useEffect } from "react";
import BoardContext from "../../context/BoardContext";
import AppContext from "../../context/AppContext";
import {
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  Done as DoneIcon,
} from "@mui/icons-material";

const PlayPanel = () => {
  const { solve, resetGame, isSolved } = useContext(BoardContext);
  const { availableProblems, problemIdx, prevProblem, nextProblem } =
    useContext(AppContext);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          if (problemIdx > 0) prevProblem();
          break;
        case "ArrowRight":
          if (problemIdx < availableProblems.length - 1) {
            nextProblem();
          }
          break;
        default:
          break;
      }
    },
    [nextProblem, prevProblem, problemIdx, availableProblems]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <Box display="flex" flexDirection="column" width={400} alignItems="center">
      <DoneIcon
        fontSize="large"
        color="success"
        sx={{ color: isSolved ? undefined : "transparent" }}
        onClick={nextProblem}
      />
      <Box display="flex" gap={1} justifyContent="space-between" width="100%">
        <Box display="none">
          <Button variant="contained" onClick={solve}>
            Solve
          </Button>
          <Button variant="outlined" onClick={resetGame}>
            Reset
          </Button>
        </Box>
        <Fab
          size="small"
          color="warning"
          disabled={problemIdx === 0}
          onClick={prevProblem}
        >
          <ArrowLeftIcon />
        </Fab>
        <Fab
          size="small"
          color="warning"
          disabled={problemIdx >= availableProblems.length - 1}
          onClick={nextProblem}
        >
          <ArrowRightIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default PlayPanel;
