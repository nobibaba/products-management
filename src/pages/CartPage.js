import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../redux/cartSlice';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Container,
  Grid,
  AppBar,
  Toolbar,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';

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
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Cart
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            component={Link}
            to="/"
            sx={{
              backgroundColor: 'white',
              color: 'black',
              '&:hover': { backgroundColor: 'lightgrey' },
            }}
          >
            Back to Homepage
          </Button>
        </Toolbar>
      </AppBar>

      {/* Cart Content */}
      <Typography variant="h4" sx={{ marginY: 2, textAlign: 'center' }}>
        Shopping Cart
      </Typography>

      {cart.length === 0 ? (
        <Typography variant="h6" align="center">
          Your cart is empty.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {cart.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{product.title}</Typography>
                  <Typography>${product.price}</Typography>
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.title}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                  )}
                  <Typography>Category: {product.category || 'N/A'}</Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center' }}>
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

      {/* Clear Cart Button */}
      {cart.length > 0 && (
        <Button
          variant="contained"
          color="error"
          onClick={handleClearCart}
          sx={{ marginTop: 3, display: 'block', marginX: 'auto' }}
        >
          Clear Cart
        </Button>
      )}

      {/* Back to Homepage Button at Bottom */}
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          sx={{
            width: '200px',
            fontWeight: 'bold',
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#135ba1' },
          }}
        >
          Back to Homepage
        </Button>
      </Box>
    </Container>
  );
};

export default CartPage;
