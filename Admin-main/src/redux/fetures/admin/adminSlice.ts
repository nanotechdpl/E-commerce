import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Admin {
  sl: string;
  photo?: string;
  name: string;
  email: string;
  url: string;
  password: string;
  accessList: string;
  active: boolean;
  [key: string]: any;
}

interface AdminState {
  isLoading: boolean;
  error: any;
  allAdmins: Admin[];
}

const demoAdmins: Admin[] = [
  {
    sl: "AD001",
    photo: "https://randomuser.me/api/portraits/men/1.jpg",
    name: "John Smith",
    email: "john.smith@admin.com",
    url: "admin.dashboard/john",
    password: "admin123",
    accessList: "Users, Orders, Settings",
    active: true
  },
  {
    sl: "AD002",
    photo: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Sarah Johnson",
    email: "sarah.j@admin.com",
    url: "admin.dashboard/sarah",
    password: "admin456",
    accessList: "Users, Reports",
    active: true
  },
  {
    sl: "AD003",
    photo: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Michael Chen",
    email: "m.chen@admin.com",
    url: "admin.dashboard/michael",
    password: "admin789",
    accessList: "Orders, Analytics",
    active: false
  },
  {
    sl: "AD004",
    photo: "https://randomuser.me/api/portraits/women/2.jpg",
    name: "Emily Davis",
    email: "emily.d@admin.com",
    url: "admin.dashboard/emily",
    password: "admin101",
    accessList: "Settings, Users",
    active: true
  },
  {
    sl: "AD005",
    photo: "https://randomuser.me/api/portraits/men/3.jpg",
    name: "James Wilson",
    email: "j.wilson@admin.com",
    url: "admin.dashboard/james",
    password: "admin202",
    accessList: "Reports, Analytics",
    active: true
  }
];

const initialState: AdminState = {
  isLoading: false,
  error: null,
  allAdmins: demoAdmins,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    fetchingAdminData: (state) => {
      state.isLoading = true;
    },
    fetchingAdminDataFailed: (state, action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = action.payload.error;
    },
    adminData: (state, action: PayloadAction<any>) => {
      // console.log(action.payload.data);
     state.isLoading = false;
     state.allAdmins = action.payload?.data
    },
    addAdmin: (state, action: PayloadAction<Admin>) => {
      state.allAdmins.push(action.payload);
      state.isLoading = false;
    },
    statusChange: (
      state,
      action: PayloadAction<{ id: string; active: boolean }>
    ) => {
      const adminIndex = state.allAdmins.findIndex(
        (admin) => admin.sl === action.payload.id
      );
      if (adminIndex !== -1) {
        state.allAdmins[adminIndex].active = action.payload.active;
        state.isLoading = false;
      }
    },
    updateAdmin: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Admin> }>
    ) => {
      const adminIndex = state.allAdmins.findIndex(
        (admin) => admin.sl === action.payload.id
      );
      if (adminIndex !== -1) {
        state.allAdmins[adminIndex] = {
          ...state.allAdmins[adminIndex],
          ...action.payload.data,
        };
        state.isLoading = false;
      }
    },
    removeAdmin: (state, action: PayloadAction<{ id: string }>) => {
      state.allAdmins = state.allAdmins.filter(
        (admin) => admin.sl !== action.payload.id
      );
      state.isLoading = false;
    },
  },
});

export const {
  addAdmin,
  updateAdmin,
  removeAdmin,
  statusChange,
  fetchingAdminData,
  adminData,
  fetchingAdminDataFailed,
} = adminSlice.actions;
export default adminSlice.reducer;
