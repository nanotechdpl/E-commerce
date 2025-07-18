
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface ReturnState {
    isLoading: boolean,
    returns: [] | null,
    returnsById: [],
    error: any
}


const initialState: ReturnState = {
    isLoading: false,
    returns: [],
    returnsById: [],
    error: null
}

const returnslice = createSlice({
    name: "returns",
    initialState,
    reducers: {

        fetchingAllReturns(state) {
            state.isLoading = true
        },
        fetchedAllReturns(state, action: PayloadAction<any>) {
            state.isLoading = false
            state.returns = action.payload?.data
        },

        AllReturnsFetchingFailed(state, action: PayloadAction<any>) {
            state.isLoading = false
            state.error = action.payload.error
        },

        fetchingSingleReturn(state) {
            state.isLoading = true
        },
        fetchedSingleReturn(state, action: PayloadAction<any>) {
            state.isLoading = false
            state.returnsById = action.payload?.data
        },

        singleReturnFetchingFailed(state, action: PayloadAction<any>) {
            state.isLoading = false
            state.error = action.payload.error
        },
    },


})

export const {
    fetchingAllReturns,
    fetchedAllReturns,
    AllReturnsFetchingFailed,
    fetchingSingleReturn,
    fetchedSingleReturn,
    singleReturnFetchingFailed,
} = returnslice.actions

export default returnslice.reducer