import { Alert, Container, Snackbar, SxProps, Theme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useCallback, useContext } from "react";
import AppContext from "../../context/AppContext";

const Layout = () => {
  const { errorMsg, setErrorMsg } = useContext(AppContext);

  const closeSnackbar = useCallback(() => {
    setErrorMsg("");
  }, [setErrorMsg]);

  return (
    <Container fixed maxWidth="xl" sx={rootSx}>
      <Header />
      <Outlet />
      <Footer />
      <Snackbar
        open={errorMsg !== ""}
        onClose={closeSnackbar}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">{errorMsg}</Alert>
      </Snackbar>
    </Container>
  );
};

export default Layout;

const rootSx: SxProps<Theme> = {
  height: "100%",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  py: 1,
  px: 2,
};
