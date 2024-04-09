import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  SxProps,
  Typography,
} from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import BoardContext from "../../context/BoardContext";
import AppContext from "../../context/AppContext";
import { Theme } from "@emotion/react";
import {
  Height as HeightIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Save as SaveIcon,
  RestartAlt as RestartAltIcon,
} from "@mui/icons-material";
import { getSolvable } from "../../solver";

const CreatePanel = () => {
  const { selectedColor, grid, emptyGrid, changeColNumber, changeRowNumber } =
    useContext(BoardContext);
  const { problemIdx, colorPalette, setErrorMsg, saveProblem } =
    useContext(AppContext);
  const [state, setState] = useState<number>(selectedColor.current ?? 0);

  const pickColor = useCallback(
    (idx: number) => () => {
      setState((prev) => (idx === prev ? 0 : idx));
    },
    []
  );

  const save = useCallback((grid: number[][]) => {
    try {
      saveProblem(getSolvable(grid));
    } catch (e) {
      setErrorMsg((e as Error).message);
    }
  }, []);

  useEffect(() => {
    selectedColor.current = state;
  }, [state]);

  const confirmEmpty = useCallback(() => {
    if (window.confirm("Confirm empty the grid?")) {
      emptyGrid();
    }
  }, [emptyGrid]);

  return (
    <Paper sx={rootSx}>
      <Box display={"flex"} alignItems="center" justifyContent="space-between">
        <Typography variant="h6">
          {problemIdx === -1 ? "New" : `Edit #${problemIdx + 1}`}
        </Typography>
        <Box display="flex">
          <IconButton onClick={confirmEmpty}>
            <RestartAltIcon />
          </IconButton>
          <IconButton onClick={() => save(grid)}>
            <SaveIcon />
          </IconButton>
        </Box>
      </Box>
      <Grid container rowGap={1}>
        {colorPalette.slice(1).map((color, idx) => (
          <Grid
            xs={2}
            key={`color-${idx}`}
            item
            display="flex"
            justifyContent="center"
          >
            <Box
              sx={pickerSx}
              bgcolor={color}
              onClick={pickColor(idx + 1)}
              borderColor={state === idx + 1 ? "white" : "transparent"}
            />
          </Grid>
        ))}
      </Grid>
      <Box display="flex" alignItems="center" gap={1}>
        <HeightIcon fontSize="large" />
        <Button
          variant="outlined"
          sx={{ flex: 1 }}
          color="inherit"
          onClick={() => changeRowNumber("+")}
        >
          <AddIcon />
        </Button>
        <Button
          variant="outlined"
          sx={{ flex: 1 }}
          color="inherit"
          onClick={() => changeRowNumber("-")}
        >
          <RemoveIcon />
        </Button>
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        <HeightIcon fontSize="large" sx={{ transform: "rotate(90deg)" }} />
        <Button
          variant="outlined"
          sx={{ flex: 1 }}
          color="inherit"
          onClick={() => changeColNumber("+")}
        >
          <AddIcon />
        </Button>
        <Button
          variant="outlined"
          sx={{ flex: 1 }}
          color="inherit"
          onClick={() => changeColNumber("-")}
        >
          <RemoveIcon />
        </Button>
      </Box>
    </Paper>
  );
};

export default CreatePanel;

const rootSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
  py: 1,
  px: 2,
};

const pickerSx: SxProps<Theme> = {
  width: 24,
  height: 24,
  borderWidth: 2,
  borderStyle: "solid",
  borderRadius: "100%",
};
