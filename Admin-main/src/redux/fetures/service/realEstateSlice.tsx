

import { createSlice } from "@reduxjs/toolkit";

export interface RealEstate {
  _id?: string;
  photo: string | null;
  type: string;
  propertyStatus: string;
  address: string;
  sizeOrSquareFeet?: string;
  priceOrBudget?: string;
  beds?: string;
  bathRoom?: string;
  kitchen?: string;
    description: string;
  features?: string[];
  visible?: string;
    isDeleted: boolean;
}

interface RealEstateState {
  realEstate: RealEstate[];
  loading: boolean;
  error: string | null;
}
const initialState: RealEstateState = {
  realEstate: [],
  loading: false,
  error: null,
};

const realEstateSlice = createSlice({
  name: "realEstate",
  initialState,
  reducers: {
    setRealEstate: (state, action) => {
      state.realEstate = action.payload;
    },
    addRealEstate: (state, action) => {
      state.realEstate.push(action.payload);
    },
    updateRealEstate: (state, action) => {
      state.realEstate = state.realEstate.map((item) =>
        item._id === action.payload._id ? action.payload : item
      );
    },
    deleteRealEstate: (state, action) => {
      state.realEstate = state.realEstate.filter(
        (item) => item._id !== action.payload
      );
    },
  },
});

export const {
  setRealEstate,
  addRealEstate,
  updateRealEstate,
  deleteRealEstate,
} = realEstateSlice.actions;

export default realEstateSlice.reducer;