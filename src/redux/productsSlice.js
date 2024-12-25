import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://dummyjson.com/products';

// Fetch Products
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get(API_URL);
  return response.data.products;
});

// Add Product
export const addProduct = createAsyncThunk('products/addProduct', async (product) => {
  const response = await axios.post(`${API_URL}/add`, product);
  return response.data;
});

// Update Product
export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, product }) => {
  const response = await axios.put(`${API_URL}/${id}`, product);
  return response.data;
});

// Delete Product
export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

const productsSlice = createSlice({
  name: 'products',
  initialState: { products: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      });
  },
});

export default productsSlice.reducer;
