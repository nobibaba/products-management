import axios from 'axios';

const API_URL = 'https://dummyjson.com/products';

export const getProducts = () => axios.get(API_URL);
export const createProduct = (product) => axios.post(`${API_URL}/add`, product);
export const updateProduct = (id, product) => axios.put(`${API_URL}/${id}`, product);
export const deleteProduct = (id) => axios.delete(`${API_URL}/${id}`);
