import React from "react";
import { Fab, Badge } from "@mui/material";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import { useCartStore } from "../store/CartStore";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const AddToCartSuccess = () => {
  const cart = useCartStore((state) => state.cart);
  const navigate = useNavigate();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  // Move to cart page
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    navigate("/cart");
  };

  // If cart is empty → return nothing
  if (cart.length === 0) return null;

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{
          position: "fixed",
          bottom: 75,
          right: 16,
          zIndex: 1000,
          cursor: "pointer",
        }}
      >
        <Badge
          badgeContent={cart.length}
          color="error"
          overlap="circular"
          sx={{
            "& .MuiBadge-badge": {
              zIndex: 1500,
              position: "absolute",
              backgroundColor: "#f44336",
              fontSize: "13px",
              padding: "3px",
            },
          }}
        >
          <Fab
            size="medium"
            sx={{
              backgroundColor: "#f44336",
              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.1)",
                backgroundColor: "#f44336",
              },
            }}
          >
            <MdOutlineShoppingCart style={{ color: "#fff", fontSize: "20px" }} />
          </Fab>
        </Badge>
      </Box>
    </Fade>
  );
};

export default AddToCartSuccess;
