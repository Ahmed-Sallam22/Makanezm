import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../types/product";

interface ProductsState {
  products: Product[];
}

const initialState: ProductsState = {
  products: [
    // Sample products
    {
      id: 1,
      name: "Fresh Beef",
      nameAr: "لحم بقري طازج",
      description: "High quality fresh beef",
      descriptionAr: "لحم بقري طازج عالي الجودة",
      price: 120,
      image: "/src/assets/images/test1.png",
      category: "meat",
      stock: 50,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Chicken Breast",
      nameAr: "صدور دجاج",
      description: "Fresh chicken breast",
      descriptionAr: "صدور دجاج طازجة",
      price: 45,
      image: "/src/assets/images/test1.png",
      category: "chicken",
      stock: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      name: "Salmon Fillet",
      nameAr: "فيليه سالمون",
      description: "Fresh salmon fillet",
      descriptionAr: "فيليه سالمون طازج",
      price: 85,
      image: "/src/assets/images/test1.png",
      category: "fish",
      stock: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    updateProduct: (
      state,
      action: PayloadAction<{ id: number; updates: Partial<Product> }>
    ) => {
      const product = state.products.find((p) => p.id === action.payload.id);
      if (product) {
        Object.assign(product, action.payload.updates);
        product.updatedAt = new Date().toISOString();
      }
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
  },
});

export const { addProduct, updateProduct, deleteProduct, setProducts } =
  productsSlice.actions;

export default productsSlice.reducer;
