import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
  isLoading: boolean;
  data: dataType[] | null;
  error: any;
}
interface dataType {
  _id?: string;
  image: string | null;
  title: string;
  projectPlanning: string;
  price: number;
  description: string;
  visible?: boolean;
}
const initialState: CategoryState = {
  isLoading: false,
  data: null,
  error: null,
};

const catslice = createSlice({
  name: "category",
  initialState,
  reducers: {
    fetchingData(state) {
      state.isLoading = true;
    },

    fetchedData(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.data = action.payload;
      console.log(state.data);
    },

    fetchingFailed(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload.error;
    },
  },
});

export const { fetchingData, fetchedData, fetchingFailed } = catslice.actions;

export default catslice.reducer;
