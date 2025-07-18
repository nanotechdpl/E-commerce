import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderState {
  isLoading: boolean;
  orders: [] | null;
  singleOrder: [];
  error: any;
}

const initialState: OrderState = {
  isLoading: false,
  orders: [],
  singleOrder: [],
  error: null,
};

const orderslice = createSlice({
  name: "order",
  initialState,
  reducers: {
    fetchingAllOrders(state) {
      state.isLoading = true;
    },
    fetchedAllOrders(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.orders = action.payload?.data;
    },

    AllOrdersFetchingFailed(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload.error;
    },

    fetchingSingleOrder(state) {
      state.isLoading = true;
    },
    fetchedSingleOrder(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.singleOrder = action.payload?.data;
    },

    SingleOrderFetchingFailed(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload.error;
    },
  },
});

export const {
  fetchingAllOrders,
  fetchedAllOrders,
  AllOrdersFetchingFailed,
  fetchingSingleOrder,
  fetchedSingleOrder,
  SingleOrderFetchingFailed,
} = orderslice.actions;

export default orderslice.reducer;
