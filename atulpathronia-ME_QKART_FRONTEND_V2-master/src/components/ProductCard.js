import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography, Stack
} from "@mui/material";
import React from "react";
import "./ProductCard.css";


const ProductCard = ({ product, handleAddToCart }) => {

  return (
    <Card className="card">
      <CardMedia image={product.image} component="img"></CardMedia>
      <CardContent>
        <Typography variant="h5">
          {product.name}
        </Typography>
        <Typography variant="h6">
          ${product.cost}
        </Typography>
        <Rating name="read-only" value={product.rating} readOnly />
        <CardActions className="card-actions">
          <Button variant="contained" fullWidth  className="card-button" onClick={handleAddToCart}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <AddShoppingCartOutlined></AddShoppingCartOutlined>
            <Typography>Add to cart</Typography>
            </Stack>
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
