import { createSlice } from "@reduxjs/toolkit";
export interface EmployeeHiring {
  _id?: string;
  photo: string | null;
  title: string;
  description: string;
  category: string;
  tag?: string;
  status?: string;
  isDeleted: boolean;
 
}

interface EmployeeHiringState {
  employeeHiring: EmployeeHiring[];
  loading: boolean;
  error: string | null;
}
const initialState: EmployeeHiringState = {
  employeeHiring: [],
  loading: false,
  error: null,
}

const employeeHiringSlice = createSlice({
  name: "employeeHiring",
  initialState,
  reducers: {
    setEmployeeHiring: (state, action) => {
      state.employeeHiring = action.payload;
    },
    addEmployeeHiring: (state, action) => {
      state.employeeHiring.push(action.payload);
    },
    updateEmployeeHiring: (state, action) => {
      state.employeeHiring = state.employeeHiring.map((item) =>
        item._id === action.payload._id ? action.payload : item
      );
    },
    deleteEmployeeHiring: (state, action) => {
      state.employeeHiring = state.employeeHiring.filter(
        (item) => item._id !== action.payload
      );
    },
  },
});

export const { setEmployeeHiring, addEmployeeHiring, updateEmployeeHiring, deleteEmployeeHiring } =
  employeeHiringSlice.actions;
export default employeeHiringSlice.reducer;