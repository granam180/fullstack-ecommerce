import { useState } from "react";
import { useDispatch } from "react-redux";
import { IconButton, Box, Typography, useTheme, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { shades } from "../theme";
import { addToCart } from "../state";
import { useNavigate } from "react-router-dom";

const Item = ({ item, width }) => {
  const navigate = useNavigate(); // react-router-dom
  const dispatch = useDispatch(); // Redux toolkit
  const [count, setCount] = useState(1); // default cart item set to '1'
  const [isHovered, setIsHovered] = useState(false);
  const {
    palette: { neutral }, // theme pallete to use
  } = useTheme();

  const { category, price, name, image } = item.attributes;
  const {
    data: {
      attributes: {
        formats: {
          medium: { url },
        },
      },
    },
  } = image;

  return (
    <Box width={width}>
      <Box
        position="relative" // display pos relative
        onMouseOver={() => setIsHovered(true)} // display count & +/- buttons
        onMouseOut={() => setIsHovered(false)}
      >
        <img
          alt={item.name}
          width="100%"
          height="100%"
          src={`https://sparkling-star-2118.fly.dev${url}`}
          onClick={() => navigate(`/item/${item.id}`)} // `navigate` to item details page for particular item.id
          style={{ cursor: "pointer" }}
        />
        <Box
        // display if isHovered state === true
          display={isHovered ? "block" : "none"}
          position="absolute"
          bottom="10%"
          left="0"
          width="80%"
          padding="0 5%"
        >
          <Box display="flex" justifyContent="space-between">
            <Box
              display="flex"
              alignItems="center"
              backgroundColor={shades.neutral[100]}
              borderRadius="3px"
            >
              <IconButton onClick={() => setCount(Math.max(count - 1, 1))}>
                <RemoveIcon />
              </IconButton>
              <Typography color={shades.primary[300]}>{count}</Typography>
              <IconButton onClick={() => setCount(count + 1)}>
                <AddIcon />
              </IconButton>
            </Box>

            {/* BUTTON */}
            <Button
              onClick={() => {
                // Redux toolkit dispatch to track `state` adding items to the cart
                dispatch(addToCart({ item: { ...item, count } }));
              }}
              sx={{ backgroundColor: shades.primary[300], color: "white" }}
            >
              Add to Cart
            </Button>
          </Box>
        </Box>
      </Box>

      {/* SUBTITLE */}
      <Box mt="3px">
        <Typography variant="subtitle2" color={neutral.dark}>
          {category
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())}
        </Typography>
        <Typography>{name}</Typography>
        <Typography fontWeight="bold">${price}</Typography>
      </Box>
    </Box>
  );
};

export default Item;
