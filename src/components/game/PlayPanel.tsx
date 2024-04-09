import { Box, Button, Fab } from "@mui/material";
import { useContext } from "react";
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

  return (
    <Box display="flex" flexDirection="column" width={400} alignItems="center">
      <DoneIcon
        fontSize="large"
        color="success"
        sx={{ color: isSolved ? undefined : "transparent" }}
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
          disabled={problemIdx === availableProblems.length - 1}
          onClick={nextProblem}
        >
          <ArrowRightIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default PlayPanel;
