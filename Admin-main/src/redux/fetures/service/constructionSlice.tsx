import { createSlice } from "@reduxjs/toolkit";

export interface Construction {
    _id?: string;
    photo: string | null;
    title: string;
    isDeleted: boolean;
    description: string;
    tag: string;
    category: string;
    status?: string;
}

interface ConstructionState {
    construction: Construction[];
    loading: boolean;
    error: string | null;
}

const initialState: ConstructionState = {
    construction: [],
    loading: false,
    error: null,
}


const constructionSlice = createSlice({
    name: "construction",
    initialState,
    reducers: {
        setConstruction: (state, action) => {
            state.construction = action.payload;
        },
        addConstruction: (state, action) => {
            state.construction.push(action.payload);
        },
        updateConstruction: (state, action) => {
            state.construction = state.construction.map(construction => construction._id === action.payload._id ? action.payload : construction);
        },
        deleteConstruction: (state, action) => {
            state.construction = state.construction.filter(construction => construction._id !== action.payload);
        },
    },
});

export const { setConstruction, addConstruction, updateConstruction, deleteConstruction } = constructionSlice.actions;

export default constructionSlice.reducer;
