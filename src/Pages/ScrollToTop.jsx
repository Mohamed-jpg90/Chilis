
import React from "react";
import { Fab } from "@mui/material";
import { FaArrowUp } from "react-icons/fa";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";

const ScrollToTop = (props) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
<Fade in={trigger}>
  <Box
    onClick={handleClick}
    role="presentation"
    sx={{
      position: "fixed",
      bottom: 16,
      right: 16,
      zIndex: 1000,
    }}
  >
    <Fab
      size="small"
      aria-label="scroll back to top"
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 1000,
        backgroundColor: "#f44336",
        transition: "0.3s",
        "&:hover": {
          backgroundColor: "#f44336",
          color: "#f44336",
          transform: "scale(1.1)",
          // boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        },
      }}
    >
      <FaArrowUp style={{
        color:"#fff"
        
        }} />
    </Fab>
  </Box>
</Fade>

  );
};

export default ScrollToTop;
