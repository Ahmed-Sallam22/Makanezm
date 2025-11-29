import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Order } from "../../types/order";

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.currentOrder = action.payload;
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ id: string; status: Order['status'] }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
        order.updatedAt = new Date().toISOString();
      }
    },
    updateOrder: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Order> }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.id);
      if (order) {
        Object.assign(order, action.payload.updates);
        order.updatedAt = new Date().toISOString();
      }
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
  },
});

export const {
  addOrder,
  updateOrderStatus,
  updateOrder,
  clearCurrentOrder,
  setOrders,
} = ordersSlice.actions;

export default ordersSlice.reducer;
