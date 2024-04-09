import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import AppContext from "../../context/AppContext";
import GridCapture from "./GridCaputre";

const ProblemSet = ({
  index,
  style,
}: {
  index: number;
  style: React.CSSProperties;
}) => {
  const { mode, availableProblems, gotoProblem, problemNameMap } =
    useContext(AppContext);

  return (
    <Box
      style={style}
      height={50}
      onClick={() => gotoProblem(availableProblems[index].uuid)}
      display="flex"
      gap={2}
      alignItems="center"
      width={"100%"}
    >
      <GridCapture problem={availableProblems[index]} />
      <Typography variant="h6">
        {`${problemNameMap[availableProblems[index].uuid]}`
          .split("")
          .map((v) => (mode === "play" ? NUM_MAP[parseInt(v, 10)] : v))
          .join("")}
      </Typography>
    </Box>
  );
};

const ProblemList = () => {
  const { availableProblems } = useContext(AppContext);

  return (
    <Box flex={1}>
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            itemCount={availableProblems.length}
            itemSize={50}
            width={width}
          >
            {ProblemSet}
          </FixedSizeList>
        )}
      </AutoSizer>
    </Box>
  );
};

export default ProblemList;

const NUM_MAP = "๐๑๒๓๔๕๖๗๘๙";
