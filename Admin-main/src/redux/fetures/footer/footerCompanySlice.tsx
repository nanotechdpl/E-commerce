import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    footerCompany: [],
    loading: false,
    error: null
}

const footerCompanySlice = createSlice({
    name: "footerCompany",
    initialState,
    reducers: {
        setFooterCompany: (state, action) => {
            state.footerCompany = action.payload;
        },
        addFooterCompany: (state, action) => {
            state.footerCompany.push(action.payload);
        },
        updateFooterCompany: (state, action) => {
            state.footerCompany = state.footerCompany.map(item => item._id === action.payload._id ? action.payload : item);
        },
        deleteFooterCompany: (state, action) => {
            state.footerCompany = state.footerCompany.filter(item => item._id !== action.payload);
        }
    }
})

export const { setFooterCompany,deleteFooterCompany, addFooterCompany, updateFooterCompany } = footerCompanySlice.actions;
export default footerCompanySlice.reducer;
