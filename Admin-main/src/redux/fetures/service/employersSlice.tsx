
import { createSlice } from "@reduxjs/toolkit";


export interface Employer {
  _id?: string;
  photo: string | null;
  name: string;
  title: string;
  links: {
    name: string;
    url: string;
  }[];
  isBestEmployee?: boolean;
  rating?: number;
  status?: string;
  isDeleted: boolean;
}
interface EmployersState {
  employers: Employer[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployersState = {
  employers: [],
  loading: false,
  error: null,
};

const employersSlice = createSlice({
  name: "employers",
  initialState,
  reducers: {
    setEmployers: (state, action) => {
      state.employers = action.payload;
    },
    addEmployer: (state, action) => {
      state.employers.push(action.payload);
    },
    updateEmployer: (state, action) => {
      state.employers = state.employers.map((item) =>
        item._id === action.payload._id ? action.payload : item
      );
    },
    deleteEmployer: (state, action) => {
      state.employers = state.employers.filter(
        (item) => item._id !== action.payload
      );
    },
  },
});

export const { setEmployers, addEmployer, updateEmployer, deleteEmployer } =
  employersSlice.actions;
export default employersSlice.reducer;
