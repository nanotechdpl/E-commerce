import { demoDashboardOrderData, demoDashboardPaymentData, demoUsers } from "@/demo";
import { IUser } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrderData } from "@/types/orderData";

export interface User {
  _id: string;
  userNumber: string;
  userUID: string;
  no: number;
  name: string;
  email: string;
  status: string;
  finance: {
    total_order: number;
    total_amount: number;
    total_paid: number;
    money_left: number;
    refund_amount: number;
    profit: number;
  };
  suspend: number;
  isSuspended: string;
  isBlocked: boolean;
  isDeleted: boolean;
  currency?: string;
  enable_2fa?: boolean;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface DashboardOrderType {
  totaluserorder: number;
  totalpendingorders: number;
  totalorderpayment: number;
  totalwaitingorders: number;
  totalworkingorders: number;
  totalcompleteorders: number;
  totaldeliveredorders: number;
  totalcancelorders: number;
  totalcancelledorders: number;
  totalprojectamount: number;
  totalmoneyleft: number;
  userorders: OrderData[];
}

export interface UserPaymentType {
  transaction_id: string;
  payment_type: string;
  amount: number;
  createdAt: string;
  status: string;
  _id: string;
}

export interface DashboardPaymentType {
  totalpendingpayment: number;
  totaluserpayment: number;
  totalsumpayment: number;
  totalacceptedpayment: number;
  totalspampayment: number;
  userpayment: UserPaymentType[];
}

export interface UserState {
  requesteUsers: User[];
  forwordRequestUsers: User[];
  allUsers: User[];
  isLoading: boolean;
  users: IUser[] | null;
  userAnalytics: any[];
  userById: User[];
  orderById: DashboardOrderType | null;
  paymentsById: DashboardPaymentType | null;
  error: any;
}



const initialState: UserState = {
  isLoading: false,
  users: null,
  userAnalytics: [],
  userById: [],
  error: null,
  orderById: demoDashboardOrderData,
  paymentsById: demoDashboardPaymentData,
  requesteUsers: [],
  forwordRequestUsers: [],
  allUsers: [],
};

const usersslice = createSlice({
  name: "users",
  initialState,
  reducers: {
    fetchingUsersData(state) {
      state.isLoading = true;
    },
    fetchedUsersData(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.users = action.payload?.data?.totaluser || [];
    },

    UsersFetchingFailed(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload.error;
    },

    fetchingSingleUserData(state) {
      state.isLoading = true;
    },
    fetchedSingleUserData(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.userById = action.payload?.data;
    },

    SingleUserFetchinFailed(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload.error;
    },

    fetchingUserAnalytics(state) {
      state.isLoading = true;
    },
    fetchedUserAnalytics(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.userAnalytics = action.payload?.data || [];
    },

    UserAnalyticsFetchinFailed(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload.error;
    },
    // New actions for fetching all users with filters
    fetchingAllUsers(state) {
      state.isLoading = true;
    },
    fetchedAllUsers(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.allUsers = action.payload?.data;
    },
    fetchedUserOrderById(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.orderById = action.payload?.data;
    },
    fetchedUserPaymentById(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.paymentsById = action.payload?.data;
    },
    AllUsersFetchingFailed(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload.error;
    },
    toggleUserFailed(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload.error;
    },
    userOrderByIdFailed(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload.error;
    },
    userPaymentsByIdFailed(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload.error;
    },
  },
});

export const {
  fetchedUsersData,
  fetchingUsersData,
  UsersFetchingFailed,
  fetchingSingleUserData,
  fetchedSingleUserData,
  SingleUserFetchinFailed,
  fetchingUserAnalytics,
  fetchedUserAnalytics,
  fetchingAllUsers,
  fetchedAllUsers,
  AllUsersFetchingFailed,
  UserAnalyticsFetchinFailed,
  toggleUserFailed,
  fetchedUserOrderById,
  userOrderByIdFailed,
  fetchedUserPaymentById,
  userPaymentsByIdFailed,
} = usersslice.actions;

export default usersslice.reducer;
