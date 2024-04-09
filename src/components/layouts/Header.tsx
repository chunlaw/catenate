import { Box, Fab } from "@mui/material";
import "../../App.css";
import {
  Menu as MenuIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import PaletteDrawer from "./PaletteDrawer";
import { useCallback, useState } from "react";
import MenuDrawer from "./MenuDrawer";

interface HeaderState {
  isMenu: boolean;
  isPalette: boolean;
}

const Header = () => {
  const [state, setState] = useState<HeaderState>(DEFAULT_STATE);

  const toggleDrawer = useCallback(
    (field: keyof HeaderState) => () => {
      setState((prev) => ({
        ...prev,
        [field]: !prev[field],
      }));
    },
    []
  );

  return (
    <Box display="flex" justifyContent="space-between" width="100%">
      <Fab onClick={toggleDrawer("isMenu")}>
        <MenuIcon />
      </Fab>
      <Fab onClick={toggleDrawer("isPalette")}>
        <SettingsIcon />
      </Fab>
      <MenuDrawer open={state.isMenu} onClose={toggleDrawer("isMenu")} />
      <PaletteDrawer
        open={state.isPalette}
        onClose={toggleDrawer("isPalette")}
      />
    </Box>
  );
};

export default Header;

const DEFAULT_STATE: HeaderState = {
  isMenu: false,
  isPalette: false,
};
