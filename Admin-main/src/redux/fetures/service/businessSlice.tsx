import  {createSlice} from "@reduxjs/toolkit";

export interface Business {
  _id?: string;
  photo: string | null;
  title: string;
  description: string;
  category: string;
  tag?: string;
  status?: string;
  isDeleted: boolean;
}

interface BusinessState {
  business: Business[];
  loading: boolean;
  error: string | null;
}

const initialState: BusinessState = {
  business: [],
  loading: false,
  error: null,
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setBusiness: (state, action) => {
      state.business = action.payload;
    },
    addBusiness: (state, action) => {
      state.business.push(action.payload);
    },
    updateBusiness: (state, action) => {
      state.business = state.business.map((item) =>
        item._id === action.payload._id ? action.payload : item
      );
    },
    deleteBusiness: (state, action) => {
      state.business = state.business.filter(
        (item) => item._id !== action.payload
      );
    },
  },
});

export const { setBusiness, addBusiness, updateBusiness, deleteBusiness } =
  businessSlice.actions;

export default businessSlice.reducer;