import { createSlice } from "@reduxjs/toolkit";


export interface Branch {
  _id?: string;
  name: string;
  email: string;
  address: string;
  photo: string | null;
  call: string ;
  links: {
    name: string;
    url: string;
  }[];
  status?: string;
  isDeleted: boolean;
}

interface BranchesState {
  branches: Branch[];
  loading: boolean;
  error: string | null;
}
const initialState: BranchesState = {
    branches: [],
    loading: false,
    error: null,
};

const branchesSlice = createSlice({
  name: "branches",
  initialState,
  reducers: {
    setBranches: (state, action) => {
      state.branches = action.payload;
    },
    addBranch: (state, action) => {
      state.branches.push(action.payload);
    },
    updateBranch: (state, action) => {
      state.branches = state.branches.map((item) =>
        item._id === action.payload._id ? action.payload : item
      );
    },
    deleteBranch: (state, action) => {
      state.branches = state.branches.filter(
        (item) => item._id !== action.payload
      );
    },
  },
});
export const { setBranches, addBranch, updateBranch, deleteBranch } =
  branchesSlice.actions;
export default branchesSlice.reducer;

