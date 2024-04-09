import { Box, Drawer, SxProps, Theme, Typography } from "@mui/material";
import { useContext } from "react";
import AppContext, { DEFAULT_COLORS } from "../../context/AppContext";
import ColorPicker from "../ColorPicker";

interface PaletteDrawerProps {
  open: boolean;
  onClose: () => void;
}

const PaletteDrawer = ({ open, onClose }: PaletteDrawerProps) => {
  const { colorPalette, setColor } = useContext(AppContext);

  return (
    <Drawer open={open} onClose={onClose} anchor="right">
      <Box sx={rootSx}>
        <Typography variant="h6">Color Palette</Typography>
        <Box display="flex" flexDirection="column" gap={1} overflow="auto">
          {colorPalette.map((color, idx) => (
            <Box
              key={`colorpicker-${idx}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              gap={2}
            >
              <Typography variant="caption">
                {idx === 0 ? "Empty grid" : `Color #${idx}`}
              </Typography>
              <ColorPicker
                value={color}
                defaultValue={DEFAULT_COLORS[idx]}
                onChange={(v) => setColor(v ?? DEFAULT_COLORS[idx], idx)}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
};

export default PaletteDrawer;

const rootSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
  p: 2,
  height: "100dvh",
};
