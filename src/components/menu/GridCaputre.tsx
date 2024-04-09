import { useContext, useMemo } from "react";
import { solveGrid } from "../../solver";
import { Box } from "@mui/material";
import AppContext from "../../context/AppContext";
import { QuestionMarkOutlined as QuestionIcon } from "@mui/icons-material";

interface GridCaptureProps {
  problem: Problem;
}

const GridCapture = ({ problem: { grid, uuid, clean } }: GridCaptureProps) => {
  const { colorPalette } = useContext(AppContext);

  const solution = useMemo(
    () => solveGrid(JSON.parse(JSON.stringify(grid))),
    [grid]
  );

  if (!clean) {
    return (
      <Box
        width={50}
        height={50}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <QuestionIcon />
      </Box>
    );
  }

  if (solution === null) {
    return null;
  }

  return (
    <Box
      width={50}
      height={50}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      {solution.map((rows, i) => (
        <Box key={`${uuid}-${i}`} display="flex">
          {rows.map((col, j) => (
            <Box
              key={`${uuid}-${i}-${j}`}
              width={5}
              height={5}
              bgcolor={colorPalette[Math.abs(col)]}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default GridCapture;
