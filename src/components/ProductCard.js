import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

const ProductCard = ({ product, onEdit, onDelete, onAddToCart }) => (
  <Card>
    <CardContent>
      <Typography variant="h5">{product.title}</Typography>
      <Typography>${product.price}</Typography>
      <Button onClick={() => onAddToCart(product)}>Add to Cart</Button>
      <Button onClick={() => onEdit(product)}>Edit</Button>
      <Button onClick={() => onDelete(product.id)}>Delete</Button>
    </CardContent>
  </Card>
);

export default ProductCard;
