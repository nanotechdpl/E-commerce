import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Export {
    _id?: string;
    photo: string | null;
    title: string;
    category: string;
    tag: string;
    isDeleted: boolean;
    description: string;
}

interface ExportState {
    exports: Export[];
    loading: boolean;
    error: string | null;
}

const initialState: ExportState = {
    exports: [],
    loading: false,
    error: null,
}

const exportSlice = createSlice({
    name: "export",
    initialState,
    reducers: {
        setExports: (state, action: PayloadAction<Export[]>) => {
            state.exports = action.payload;
        },
        addExport: (state, action: PayloadAction<Export>) => {
            state.exports.push(action.payload);
        },
        updateExport: (state, action: PayloadAction<Export>) => {
            state.exports = state.exports.map(existingExport =>
                existingExport._id === action.payload._id ? action.payload : existingExport
            );
        },
        deleteExport: (state, action: PayloadAction<string>) => {
            state.exports = state.exports.filter(existingExport => existingExport._id !== action.payload);
        },
    },
})

export const { setExports, addExport, updateExport, deleteExport } = exportSlice.actions;

export default exportSlice.reducer;


