import { Box } from "@mui/system";
import Board from "../components/game/Board";
import CreatePanel from "../components/game/CreatePanel";
import PlayPanel from "../components/game/PlayPanel";
import { useContext } from "react";
import AppContext from "../context/AppContext";
import { Typography } from "@mui/material";
import { replaceNumToThai } from "../utils";

const GamePage = () => {
  const { mode, problemIdx, problems } = useContext(AppContext);
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={4}
      alignItems="center"
      flex={1}
    >
      {mode === "play" && (
        <Typography variant="h3">
          {replaceNumToThai(`${problemIdx + 1}`)}
        </Typography>
      )}
      <Box flex={1} display="flex" justifyContent="center" alignItems="center">
        <Board />
      </Box>
      {mode === "play" ? <PlayPanel /> : <CreatePanel />}
    </Box>
  );
};

export default GamePage;
