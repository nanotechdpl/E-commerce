import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Agency {
  id: string;
  name: string;
  location?: string;
  [key: string]: unknown; // Allow additional dynamic properties
}

interface AgencyState {
  isLoading: boolean;
  agenies: Agency[] | null;
  agencyById: Agency[];
  agencyAnalytics: any[]; // Use `any[]` instead of `[]`
  singleAgency: Agency | null;
  error: unknown;
}

const initialState: AgencyState = {
  isLoading: false,
  agenies: [],
  agencyById: [],
  agencyAnalytics: [],
  singleAgency: null,
  error: null,
};

const agencyslice = createSlice({
  name: "agency",
  initialState,
  reducers: {
    fetchingAllAgenies(state) {
      state.isLoading = true;
    },
    fetchedAllAgenies(state, action: PayloadAction<Agency[]>) {
      state.isLoading = false;
      state.agenies = action.payload;
    },
    fetchingSingleAgency(state) {
      state.isLoading = true;
    },
    fetchedSingleAgency(state, action: PayloadAction<Agency>) {
      state.isLoading = false;
      state.singleAgency = action.payload;
    },

    AllAgeniesFetchingFailed(state, action: PayloadAction<{ error: string }>) {
      state.isLoading = false;
      state.error = action.payload.error;
    },
    singleAgencyFetchingFailed(state, action: PayloadAction<{ error: string }>) {
      state.isLoading = false;
      state.error = action.payload.error;
    },

    fetchingAgencyAnalytics(state) {
      state.isLoading = true;
    },
    fetchedAgencyAnalytics(state, action: PayloadAction<any[]>) {
      state.isLoading = false;
      state.agencyAnalytics = action.payload;
    },

    AgencyAnalyticsFetchingFailed(state, action: PayloadAction<{ error: string }>) {
      state.isLoading = false;
      state.error = action.payload.error;
    },
  },
});

export const {
  fetchingAllAgenies,
  fetchedAllAgenies,
  AllAgeniesFetchingFailed,
  fetchingAgencyAnalytics,
  fetchedAgencyAnalytics,
  AgencyAnalyticsFetchingFailed,
  fetchingSingleAgency,
  fetchedSingleAgency,
  singleAgencyFetchingFailed,
} = agencyslice.actions;

export default agencyslice.reducer;
