import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrderData } from "@/types/orderData";
import { demoOrders, demoPayments, demoReturns, demoAgencies } from "@/demo";
import { IPayment } from "@/types/payment";
import { IWithdraw } from "@/types/payment";
import { IAgency } from "@/types/agency";




export interface DashboardOrders {
  totaluserorder: number;
  totalpendingorders: number;
  totalorderpayment: number;
  totalwaitingorders: number;
  totalworkingorders: number;
  totalcompleteorders: number;
  totaldeliveredorders: number;
  totalcancelorders: number;
  userorders: OrderData[];
}

export interface DashboardPayments {
  totalsumpayment: number;
  totaluserpayment: number;
  totalpendingpayment: number;
  totalacceptedpayment: number;
  totalspampayment: number;
  userpayment: IPayment[];
}
export interface DashboardReturns {
  totaluserrefund: number;
  totalsumrefund: number;
  totalpendingrefund: number;
  totalsedningrefund: number;
  totalIneligibleRefund: number;
  userrefund: IWithdraw[];
}
export interface DashboardAgencies {
  totalAgency: number;
  agencies: IAgency[];
}

interface OrderState {
  isLoading: boolean;
  orders: DashboardOrders | null;
  users: {
    totalusers: number;
  } | null;
  payments: DashboardPayments| null;
  returns: DashboardReturns | null;
  agencies:DashboardAgencies | null;
  error: any;
}

const initialState: OrderState = {
  isLoading: false,
  orders: null,
  users: null,
  payments: null,
  returns: null,
  agencies: null,
  error: null,
};

const dashboard = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    fetching(state) {
      state.isLoading = true;
    },
    fetchedDashboardOrders(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.orders = action.payload?.data;
    },

    DashboardOrdersFetchingFailed(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload.error;
    },
    fetchedDashboardUsers(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.users = action.payload?.data;
    },

    DashboardUsersFetchingFailed(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload.error;
    },
    fetchedDashboardPayments(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.payments = action.payload?.data;
    },

    DashboardPaymentsFetchingFailed(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload.error;
    },
    fetchedDashboardReturns(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.returns = action.payload?.data;
    },

    DashboardReturnsFetchingFailed(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload.error;
    },
    fetchedDashboardAgencies(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.agencies = action.payload?.data;
    },

    DashboardAgenciesFetchingFailed(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload.error;
    },
  },
});

export const {
  fetching,
  fetchedDashboardOrders,
  DashboardOrdersFetchingFailed,
  DashboardUsersFetchingFailed,
  fetchedDashboardUsers,
  fetchedDashboardPayments,
  fetchedDashboardReturns,
  DashboardReturnsFetchingFailed,
  DashboardPaymentsFetchingFailed,
  fetchedDashboardAgencies,
  DashboardAgenciesFetchingFailed,
} = dashboard.actions;

export default dashboard.reducer;
