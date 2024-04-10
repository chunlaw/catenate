import { useContext, useMemo } from "react";
import { Box } from "@mui/material";
import AppContext from "../../context/AppContext";
import { Problem } from "../../type";

interface GridCaptureProps {
  problem: Problem;
}

const GridCapture = ({
  problem: { grid, solution, uuid },
}: GridCaptureProps) => {
  const { colorPalette } = useContext(AppContext);

  const source = useMemo(() => solution ?? grid, [solution, grid]);

  return (
    <Box
      width={75}
      height={75}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      {source.map((rows, i) => (
        <Box key={`${uuid}-${i}`} display="flex">
          {rows.map((col, j) => (
            <Box
              key={`${uuid}-${i}-${j}`}
              width={7.5}
              height={7.5}
              bgcolor={colorPalette[Math.abs(col)]}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default GridCapture;
