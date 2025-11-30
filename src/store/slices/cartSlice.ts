import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { InstallmentTier } from "../../types/product";

interface CartItem {
  id: number;
  name: string;
  price: number; // Base price
  quantity: number;
  progress?: number;
  image?: string;
  // Installment options
  allowInstallment?: boolean;
  installmentOptions?: InstallmentTier[];
  selectedInstallment?: InstallmentTier | null; // Selected installment tier (null = cash)
}

interface CartState {
  items: CartItem[];
  total: number; // Base total without installment fees
  installmentTotal: number; // Total with installment fees
}

const initialState: CartState = {
  items: [],
  total: 0,
  installmentTotal: 0,
};

// Helper to calculate totals
const calculateTotals = (items: CartItem[]) => {
  let total = 0;
  let installmentTotal = 0;
  
  items.forEach(item => {
    const baseAmount = item.price * item.quantity;
    total += baseAmount;
    
    if (item.selectedInstallment) {
      const installmentAmount = baseAmount * (1 + item.selectedInstallment.percentage / 100);
      installmentTotal += installmentAmount;
    } else {
      installmentTotal += baseAmount;
    }
  });
  
  return { total, installmentTotal };
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.installmentTotal = totals.installmentTotal;
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.installmentTotal = totals.installmentTotal;
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);

      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== action.payload.id);
        }
      }

      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.installmentTotal = totals.installmentTotal;
    },
    // Set installment option for a cart item
    setItemInstallment: (
      state,
      action: PayloadAction<{ id: number; installment: InstallmentTier | null }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.selectedInstallment = action.payload.installment;
      }
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.installmentTotal = totals.installmentTotal;
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.installmentTotal = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, setItemInstallment, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
