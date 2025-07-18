import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Traveling {
    _id?: string;
    photo: string | null;
    title: string;
    description: string;
    category: string;
    places?: number;
     status?: string;
  isDeleted: boolean;
}

interface TravelingState {
    travelings: Traveling[];
    loading: boolean;
    error: string | null;
}

const initialState: TravelingState = {
    travelings: [],
    loading: false,
    error: null,
}

const travelingSlice = createSlice({
    name: "traveling",
    initialState,
    reducers: {
        setTravelings: (state, action: PayloadAction<Traveling[]>) => {
            state.travelings = action.payload;
        },
        addTraveling: (state, action: PayloadAction<Traveling>) => {
            state.travelings.push(action.payload);
        },
        updateTraveling: (state, action: PayloadAction<Traveling>) => {
            state.travelings = state.travelings.map(existingTraveling =>
                existingTraveling._id === action.payload._id ? action.payload : existingTraveling
            );
        },
        deleteTraveling: (state, action: PayloadAction<string>) => {
            state.travelings = state.travelings.filter(existingTraveling => existingTraveling._id !== action.payload);
        },
    },
});

export const { setTravelings, addTraveling, updateTraveling, deleteTraveling } = travelingSlice.actions;
export default travelingSlice.reducer;
