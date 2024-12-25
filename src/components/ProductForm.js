import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button } from '@mui/material';

const ProductForm = ({ onSubmit, defaultValues }) => {
  const { register, handleSubmit } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField {...register('title')} label="Title" fullWidth />
      <TextField {...register('price')} label="Price" fullWidth />
      <Button type="submit">Save</Button>
    </form>
  );
};

export default ProductForm;
