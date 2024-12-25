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

// Utility for resetting form data
const defaultFormData = { title: '', price: '', image: '', category: '' };

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  const [localProducts, setLocalProducts] = useState([]);
  const [dialogConfig, setDialogConfig] = useState({ open: false, isEdit: false });
  const [formData, setFormData] = useState(defaultFormData);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    const savedProducts = localStorage.getItem('localProducts');
    if (savedProducts) setLocalProducts(JSON.parse(savedProducts));
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('localProducts', JSON.stringify(localProducts));
  }, [localProducts]);

  const openDialog = (isEdit = false, product = defaultFormData) => {
    setDialogConfig({ open: true, isEdit });
    setFormData(product);
    setImagePreview(product.image || '');
  };

  const closeDialog = () => {
    setDialogConfig({ open: false, isEdit: false });
    setFormData(defaultFormData);
    setImagePreview('');
    setImageFile(null);
  };

  const handleDeleteProduct = (id) => {
    dispatch(deleteProduct(id));
    setLocalProducts((prev) => prev.filter((p) => p.id !== id));
    setSnackbarOpen(true);
  };

  const handleFormSubmit = () => {
    const finalImage = imageFile ? URL.createObjectURL(imageFile) : formData.image;
    const productData = { ...formData, image: finalImage };

    if (dialogConfig.isEdit) {
      dispatch(updateProduct({ id: formData.id, product: productData }));
      setLocalProducts((prev) =>
        prev.map((p) => (p.id === formData.id ? { ...p, ...productData } : p))
      );
    } else {
      const newProduct = { ...productData, id: `local-${Date.now()}` };
      setLocalProducts((prev) => [...prev, newProduct]);
    }

    closeDialog();
    setSnackbarOpen(true);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    setSnackbarOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const allProducts = [
    ...products,
    ...localProducts.filter((localProd) => !products.some((apiProd) => apiProd.id === localProd.id)),
  ];

  return (
    <Container>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Products Management</Typography>
          <Button color="inherit" onClick={() => openDialog()}>Add Product</Button>
          <Button color="inherit" component={Link} to="/cart">My Cart</Button>
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
                {product.image && (
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.title}
                    sx={{ width: '100%', height: '200px', objectFit: 'contain' }}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" align="center">{product.title}</Typography>
                  <Typography align="center">${product.price}</Typography>
                  <Typography align="center">Category: {product.category || 'N/A'}</Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center' }}>
                  <Button onClick={() => openDialog(true, product)}>Edit</Button>
                  <Button onClick={() => handleDeleteProduct(product.id)} color="error">Delete</Button>
                  <Button onClick={() => handleAddToCart(product)} color="primary">Add to Cart</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogConfig.open} onClose={closeDialog}>
        <DialogTitle>{dialogConfig.isEdit ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="dense"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            label="Price"
            fullWidth
            margin="dense"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
            Upload Image
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Button>
          {imagePreview && <Avatar src={imagePreview} sx={{ width: 100, height: 100, mt: 2 }} />}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Category</InputLabel>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Clothing">Clothing</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductsPage;
