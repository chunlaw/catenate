import {
  Box,
  Button,
  Drawer,
  SxProps,
  Theme,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import AppContext from "../../context/AppContext";
import {
  Add as AddIcon,
  SportsEsportsOutlined as SportsEsportsIcon,
  DesignServicesOutlined as DesignServicesOutlinedIcon,
} from "@mui/icons-material";
import ProblemList from "../menu/ProblemList";

interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MenuDrawer = ({ open, onClose }: MenuDrawerProps) => {
  const { mode, toggleMode, createNewBoard } = useContext(AppContext);

  return (
    <Drawer open={open} onClose={onClose} anchor="left">
      <Box sx={rootSx}>
        <Typography variant="h6">Pack</Typography>
        <Box flex={1} display="flex" flexDirection="column" minWidth={300}>
          {mode === "create" && (
            <Button
              startIcon={<AddIcon />}
              variant="text"
              color="inherit"
              sx={{ textTransform: "none" }}
              onClick={createNewBoard}
            >
              New Board
            </Button>
          )}
          <ProblemList />
        </Box>
        <ToggleButtonGroup
          value={mode}
          onChange={toggleMode}
          size="small"
          exclusive
          sx={{ alignSelf: "flex-end" }}
        >
          <ToggleButton value="play">
            <SportsEsportsIcon />
          </ToggleButton>
          <ToggleButton value="create">
            <DesignServicesOutlinedIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Drawer>
  );
};

export default MenuDrawer;

const rootSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
  p: 2,
  height: "100dvh",
};
