import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { demoPaymentTracker } from "@/demo";

interface Payment {
  // Define the structure of a payment object
  id: string;
  amount: number;
  status: string;
  [key: string]: unknown; // Allow additional properties if necessary
}

interface PaymentState {
  isLoading: boolean;
  payments: Payment[] | null;
  paymentTracker: Payment[];
  singlePayment: Payment | null;
  error: unknown;
}

const initialState: PaymentState = {
  isLoading: false,
  payments: [],
  paymentTracker: demoPaymentTracker,
  singlePayment: null,
  error: null,
};

const paymentslice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    fetchingAllPayments(state) {
      state.isLoading = true;
    },
    fetchingASingleayment(state) {
      state.isLoading = true;
    },
    fetchedAllPayments(state, action: PayloadAction<Payment[]>) {
      state.isLoading = false;
      state.payments = action.payload;
    },
    fetchedSinglePayment(state, action: PayloadAction<Payment>) {
      state.isLoading = false;
      state.singlePayment = action.payload;
    },

    AllPaymentsFetchingFailed(state, action: PayloadAction<{ error: string }>) {
      state.isLoading = false;
      state.error = action.payload.error;
    },
    singlePaymentsFetchingFailed(state, action: PayloadAction<{ error: string }>) {
      state.isLoading = false;
      state.error = action.payload.error;
    },

    fetchingPaymentTracker(state) {
      state.isLoading = true;
    },
    fetchedPaymentTracker(state, action: PayloadAction<Payment[]>) {
      state.isLoading = false;
      state.paymentTracker = action.payload;
    },

    PaymentTrackerFetchingFailed(state, action: PayloadAction<{ error: string }>) {
      state.isLoading = false;
      state.error = action.payload.error;
    },
  },
});

export const {
  fetchingAllPayments,
  fetchedAllPayments,
  AllPaymentsFetchingFailed,
  fetchingPaymentTracker,
  fetchedPaymentTracker,
  PaymentTrackerFetchingFailed,
  singlePaymentsFetchingFailed,
  fetchedSinglePayment,
  fetchingASingleayment,
} = paymentslice.actions;

export default paymentslice.reducer;
