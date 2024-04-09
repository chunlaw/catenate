import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BoardContextProvider } from "./context/BoardContext.tsx";
import { AppContextProvider } from "./context/AppContext.tsx";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BoardContextProvider>
        <AppContextProvider>
          <CssBaseline />
          <App />
        </AppContextProvider>
      </BoardContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
