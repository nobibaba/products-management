import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../redux/cartSlice';
import { Card, CardContent, CardActions, Button, Typography, Container, Grid } from '@mui/material';

const CartPage = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        My Cart
      </Typography>
      {cart.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <Grid container spacing={2}>
          {cart.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{product.title}</Typography>
                  <Typography>${product.price}</Typography>
                  {product.image && (
                    <img src={product.image} alt={product.title} width="100%" />
                  )}
                  <Typography>Category: {product.category || 'N/A'}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    onClick={() => handleRemoveFromCart(product.id)}
                    color="error"
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {cart.length > 0 && (
        <Button
          variant="contained"
          color="error"
          onClick={handleClearCart}
          sx={{ marginTop: 2 }}
        >
          Clear Cart
        </Button>
      )}
    </Container>
  );
};

export default CartPage;
