import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, addProduct, updateProduct } from '../redux/productsSlice';
import { addToCart } from '../redux/cartSlice';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Container,
  Select,
  MenuItem,
  Box,
  Avatar,
  FormControl,
  InputLabel,
  CardMedia,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  const [localProducts, setLocalProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    image: '',
    category: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Fetch API and Local Storage Products
  useEffect(() => {
    dispatch(fetchProducts());
    const savedProducts = localStorage.getItem('localProducts');
    if (savedProducts) {
      setLocalProducts(JSON.parse(savedProducts));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('localProducts', JSON.stringify(localProducts));
  }, [localProducts]);

  // Open Add Dialog
  const handleAddProduct = () => {
    setEditProduct(null);
    setFormData({ title: '', price: '', image: '', category: '' });
    setImagePreview('');
    setOpenDialog(true);
  };

  // Open Edit Dialog
  const handleEditProduct = (product) => {
    setEditProduct(product);
    setFormData({
      title: product.title,
      price: product.price,
      image: product.image || '',
      category: product.category || '',
    });
    setImagePreview(product.image || '');
    setOpenDialog(true);
  };

  // Delete Product
  const handleDeleteProduct = (id) => {
    dispatch(deleteProduct(id));
    setLocalProducts((prev) => prev.filter((p) => p.id !== id));
    setSnackbarOpen(true);
  };

  // Submit Add/Edit Form
  const handleFormSubmit = () => {
    let finalImage = formData.image;

    if (imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);
      finalImage = imageUrl;
    }

    const productData = {
      ...formData,
      image: finalImage,
    };

    if (editProduct) {
      dispatch(updateProduct({ id: editProduct.id, product: productData }));
      setLocalProducts((prev) =>
        prev.map((p) => (p.id === editProduct.id ? { ...p, ...productData } : p))
      );
    } else {
      const newProduct = { ...productData, id: `local-${Date.now()}` };
      setLocalProducts((prev) => [...prev, newProduct]);
    }

    setOpenDialog(false);
    setSnackbarOpen(true);
    setImageFile(null);
    setImagePreview('');
  };

  // Add to Cart
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    setSnackbarOpen(true);
  };

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Combine API and Local Products
  const allProducts = [
    ...products,
    ...localProducts.filter(
      (localProd) => !products.some((apiProd) => apiProd.id === localProd.id)
    ),
  ];

  return (
    <Container>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Products Management
          </Typography>
          <Button color="inherit" onClick={handleAddProduct}>
            Add Product
          </Button>
          <Button color="inherit" component={Link} to="/cart">
            My Cart
          </Button>
        </Toolbar>
      </AppBar>

      {/* Product Grid */}
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {allProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                {/* Product Image */}
                {product.image && (
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.title}
                    sx={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'contain',
                    }}
                  />
                )}
                {/* Product Details */}
                <CardContent>
                  <Typography variant="h6" align="center">
                    {product.title}
                  </Typography>
                  <Typography align="center">${product.price}</Typography>
                  <Typography align="center">
                    Category: {product.category || 'N/A'}
                  </Typography>
                </CardContent>
                {/* Actions */}
                <CardActions sx={{ justifyContent: 'center' }}>
                  <Button onClick={() => handleEditProduct(product)}>Edit</Button>
                  <Button onClick={() => handleDeleteProduct(product.id)} color="error">
                    Delete
                  </Button>
                  <Button onClick={() => handleAddToCart(product)} color="primary">
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <TextField label="Title" fullWidth margin="dense" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <TextField label="Price" fullWidth margin="dense" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
          <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
            Upload Image
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Button>
          {imagePreview && <Avatar src={imagePreview} sx={{ width: 100, height: 100, mt: 2 }} />}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Category</InputLabel>
            <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Clothing">Clothing</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductsPage;
