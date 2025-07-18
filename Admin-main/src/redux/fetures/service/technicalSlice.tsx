import { createSlice } from "@reduxjs/toolkit";

export interface Technical {
  _id?: string;
  photo: string | null;
  title: string;
  description: string;
  category: string;
  tag?: string;
  status?: string;
  isDeleted: boolean;
 
}

interface TechnicalState {
  technical: Technical[];
  loading: boolean;
  error: string | null;
}

const initialState: TechnicalState = {
  technical: [],
  loading: false,
  error: null,
};

const technicalSlice = createSlice({
  name: "technical",
  initialState,
  reducers: {
    setTechnical: (state, action) => {
      state.technical = action.payload;
    },
    addTechnical: (state, action) => {
      state.technical.push(action.payload);
    },
    updateTechnical: (state, action) => {
      state.technical = state.technical.map((item) =>
        item._id === action.payload._id ? action.payload : item
      );
    },
    deleteTechnical: (state, action) => {
      state.technical = state.technical.filter(
        (item) => item._id !== action.payload
      );
    },
  },
});

export const { setTechnical, addTechnical, updateTechnical, deleteTechnical } =
  technicalSlice.actions;
export default technicalSlice.reducer;
