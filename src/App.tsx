import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import GamePage from "./pages/GamePage";
import DiyGamePage from "./pages/DiyGamePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<GamePage />} />
          <Route path="diy/:base64" element={<DiyGamePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
