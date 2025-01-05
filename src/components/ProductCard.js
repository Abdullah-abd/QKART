// eslint-disable-next-line
import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  // eslint-disable-next-line
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  
  return (
        <Card className="card" key={product._id}>
          <CardMedia
            component="img"
            image={product.image}
            alt={product.name}
            className="product-image"
          />
          <CardContent>
            <Typography variant="h6" component="div">
              {product.name}
            </Typography>
            {/* <Typography variant="body2" color="textSecondary">
              Category: {product.category}
            </Typography> */}
            <Box
              // display="flex"
              // justifyContent="space-between"
              // alignItems="center"
              marginTop={1}
            >
              <Typography variant="h6" className="cost">
                ${product.cost}
              </Typography>
              <Rating name="product-rating" value={product.rating} readOnly />
            </Box>
            <Button
            variant="contained"
            className="button"
            onClick={() => handleAddToCart(product._id)}
          >
            ADD TO CART
          </Button>
          </CardContent> 
        </Card> 
  );
};

export default ProductCard;
