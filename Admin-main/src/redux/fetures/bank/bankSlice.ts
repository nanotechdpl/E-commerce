import { createSlice } from "@reduxjs/toolkit";
import { IBank } from "@/types/bank";

const initialState: IBank[] = [
  {
    sl: "4",
    bankName: "SBI Bank",
    bankLogo: "/icons/image 7652.png",
    qrCode: "/icons/image 7653.png",
    accountInfo: "A/C 46464944994, Router number: 4646, BIN Number 4646644, Branch: USA",
    taxInfo: "2%",
    currency: "20",
    see: true,
  },
  {
    sl: "3",
    bankName: "Bitcoin",
    bankLogo: "/icons/image 7652.png",
    qrCode: "/icons/image 7653.png",
    accountInfo: "A/C 46464944994, Router number: 4646, BIN Number 4646644, Branch: USA",
    taxInfo: "2%",
    currency: "70",
    see: true,
  },
  {
    sl: "2",
    bankName: "US Bank",
    bankLogo: "/icons/image 7652.png",
    qrCode: "/icons/image 7653.png",
    accountInfo: "A/C 46464944994, Router number: 4646, BIN Number 4646644, Branch: USA",
    taxInfo: "3%",
    currency: "40",
    see: true,
  },
  {
    sl: "1",
    bankName: "UK Bank",
    bankLogo: "/icons/image 7652.png",
    qrCode: "/icons/image 7653.png",
    accountInfo: "A/C 46464944994, Router number: 4646, BIN Number 4646644, Branch: UK",
    taxInfo: "5%",
    currency: "50",
    see: true,
  },
];

const bankSlice = createSlice({
  name: "bank",
  initialState,
  reducers: {
    addBank: (state, action) => {
      state.push(action.payload);
    },
    statusChange: (state, action) => {
      const { id, active } = action.payload;
      const bankIndex = state.findIndex((bank) => bank.sl === id);
      if (bankIndex !== -1) {
        state[bankIndex].see = active; // Assuming you meant to change the "see" status
      }
    },
    updateBank: (state, action) => {
      const updatedBank = action.payload;
      const bankIndex = state.findIndex(
        (bank) => bank.sl === updatedBank.id
      );
      if (bankIndex !== -1) {
        state[bankIndex] = updatedBank;
      }
    },
    removeBank: (state, action) => {
      const { id } = action.payload;
      return state.filter((bank) => bank.sl !== id);
    },
  },
});

export const { addBank, updateBank, removeBank, statusChange } = bankSlice.actions;
export default bankSlice.reducer;
