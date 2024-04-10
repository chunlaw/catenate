import { Box } from "@mui/system";
import Board from "../components/game/Board";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { Done as DoneIcon } from "@mui/icons-material";
import AppContext from "../context/AppContext";
import BoardContext from "../context/BoardContext";

const DiyGamePage = () => {
  const { base64 } = useParams();
  const { loadProblem } = useContext(AppContext);
  const { isSolved } = useContext(BoardContext);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      loadProblem(base64 ?? "");
    } catch {
      navigate("/");
    }
  }, [base64, loadProblem]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={4}
      alignItems="center"
      flex={1}
    >
      <Box flex={1} display="flex" justifyContent="center" alignItems="center">
        <Board />
      </Box>
      {isSolved && (
        <Box
          display="flex"
          flexDirection="column"
          width={400}
          alignItems="center"
        >
          <DoneIcon
            fontSize="large"
            color="success"
            sx={{ color: isSolved ? undefined : "transparent" }}
          />
        </Box>
      )}
    </Box>
  );
};

export default DiyGamePage;
