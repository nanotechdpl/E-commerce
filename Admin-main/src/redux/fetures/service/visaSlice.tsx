import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Visa {
    _id?: string;
    photo: string | null;
    title: string;
    isDeleted: boolean;
    category: string;
    description: string;
    status?:string
}
interface VisaState {
  visas: Visa[];
  loading: boolean;
  error: string | null;
}

const initialState: VisaState = {
  visas: [],
  loading: false,
  error: null,
};

const visaSlice = createSlice({
  name: "visa",
  initialState,
  reducers: {
    setVisas: (state, action: PayloadAction<Visa[]>) => {
      state.visas = action.payload;
    },
    addVisa: (state, action: PayloadAction<Visa>) => {
      state.visas.push(action.payload);
    },
    updateVisa: (state, action: PayloadAction<Visa>) => {
      state.visas = state.visas.map((existingVisa) =>
        existingVisa._id === action.payload._id ? action.payload : existingVisa
      );
    },
    deleteVisa: (state, action: PayloadAction<string>) => {
      state.visas = state.visas.filter(
        (existingVisa) => existingVisa._id !== action.payload
      );
    },
  },
});

export const { setVisas, addVisa, updateVisa, deleteVisa } = visaSlice.actions;

export default visaSlice.reducer;
