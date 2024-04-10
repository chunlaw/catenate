import { Box, IconButton, Typography } from "@mui/material";
import React, { useContext } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import AppContext from "../../context/AppContext";
import GridCapture from "./GridCaputre";
import { replaceNumToThai } from "../../utils";
import { GameTab } from "../../type";
import { Share as ShareIcon } from "@mui/icons-material";

const ProblemSet = ({
  index,
  style,
  data: { onClick, type },
}: {
  index: number;
  style: React.CSSProperties;
  data: {
    onClick: (e: React.MouseEvent) => void;
    type: GameTab;
  };
}) => {
  const {
    mode,
    availableProblems,
    availableExtraProblems,
    gotoProblem,
    problemNameMap,
    shareProblem,
  } = useContext(AppContext);

  const _problems =
    type === "Stage" ? availableProblems : availableExtraProblems;

  return (
    <Box
      style={style}
      height={75}
      display="flex"
      gap={2}
      alignItems="center"
      justifyContent="space-between"
      width={"100%"}
      sx={{ cursor: "pointer" }}
    >
      <Box
        display="flex"
        alignItems="center"
        onClick={(e) => {
          gotoProblem(_problems[index].uuid);
          onClick(e);
        }}
      >
        <GridCapture problem={_problems[index]} />
        <Typography variant="h4">
          {mode === "play"
            ? replaceNumToThai(`${problemNameMap[_problems[index].uuid]}`)
            : `${problemNameMap[_problems[index].uuid]}`}
        </Typography>
      </Box>
      {type === "DIY" && (
        <IconButton onClick={() => shareProblem(_problems[index].uuid)}>
          <ShareIcon />
        </IconButton>
      )}
    </Box>
  );
};

interface ProblemListProps {
  type: GameTab;
  onClick: (e: React.MouseEvent) => void;
}

const ProblemList = ({ type, onClick }: ProblemListProps) => {
  const { availableProblems, availableExtraProblems } = useContext(AppContext);

  return (
    <Box flex={1}>
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            itemCount={
              type === "Stage"
                ? availableProblems.length
                : availableExtraProblems.length
            }
            itemSize={75}
            width={width}
            itemData={{ onClick, type }}
          >
            {ProblemSet}
          </FixedSizeList>
        )}
      </AutoSizer>
    </Box>
  );
};

export default ProblemList;
