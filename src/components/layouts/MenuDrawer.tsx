import {
  Box,
  Button,
  Drawer,
  IconButton,
  Snackbar,
  SxProps,
  Tab,
  Tabs,
  Theme,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useCallback, useContext, useMemo, useState } from "react";
import AppContext from "../../context/AppContext";
import {
  Add as AddIcon,
  SportsEsportsOutlined as SportsEsportsIcon,
  DesignServicesOutlined as DesignServicesOutlinedIcon,
  GitHub as GitHubIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import ProblemList from "../menu/ProblemList";
import { useNavigate } from "react-router-dom";
import { GameTab } from "../../type";

interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MenuDrawer = ({ open, onClose }: MenuDrawerProps) => {
  const { problems, mode, toggleMode, createNewBoard, isCopied, setCopied } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState<GameTab>("Stage");

  const isAllSolved = useMemo(() => {
    return (
      import.meta.env.DEV ||
      problems.filter(({ extra, clean }) => !extra && clean).length >= 20
    );
  }, [problems]);

  const handleGithub = useCallback(() => {
    window.open("https://github.com/chunlaw/catenate", "_blank");
  }, []);

  return (
    <Drawer open={open} onClose={onClose} anchor="left">
      <Box sx={rootSx}>
        <Typography variant="h3" sx={linkSx} onClick={() => navigate("/")}>
          Catenate
        </Typography>
        <Box flex={1} display="flex" flexDirection="column" minWidth={300}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab value="Stage" label="Stage" />
            <Tab value="DIY" label={`DIY ${!isAllSolved ? "🔒" : ""}`} />
          </Tabs>
          {tab === "DIY" && (
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              color="inherit"
              sx={{ textTransform: "none", my: 2 }}
              onClick={() => {
                createNewBoard();
                onClose();
              }}
              disabled={!isAllSolved || mode === "play"}
              endIcon={!isAllSolved ? <LockIcon /> : undefined}
            >
              New Board
            </Button>
          )}
          <ProblemList onClick={onClose} type={tab} />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <IconButton onClick={handleGithub}>
            <GitHubIcon />
          </IconButton>
          {isAllSolved && (
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
          )}
        </Box>
        <Typography variant="caption" color="GrayText">
          Chun Law © 2024
        </Typography>
      </Box>
      <Snackbar
        open={isCopied}
        onClose={() => setCopied(false)}
        autoHideDuration={1000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        message="Copied"
        sx={{ zIndex: 10000 }}
      />
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

const linkSx: SxProps<Theme> = {
  cursor: "pointer",
};
