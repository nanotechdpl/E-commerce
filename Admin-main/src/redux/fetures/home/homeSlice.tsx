import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HomeState {
  isUploadingImage: boolean;
  isSubmitting: boolean;
  isFetchingData: boolean;
  banner: any[] | null;
  threeCards: any[];
  fourCards: any[];
  contacts: any[];
  seccirity: any[];
  gallary: any[];
  suportedIcons: any[];
  paymentIcons: any[];
  status: string;
  message: string;
  error: any;
}

const initialState: HomeState = {
  isUploadingImage: false,
  isSubmitting: false,
  isFetchingData: false,
  banner: [],
  contacts: [],
  threeCards: [],
  fourCards: [],
  seccirity: [],
  gallary: [],
  suportedIcons: [],
  paymentIcons: [],
  status: "",
  message: "",
  error: {},
};

const homeslice = createSlice({
  name: "home",
  initialState,
  reducers: {
    fetching(state) {
      state.isFetchingData = true;
    },
    fetchedContactsData(state, action: PayloadAction<{ data: any[] }>) {
      state.isFetchingData = false;
      state.contacts = action.payload.data || [];
    },
    fetchedSocialIcosData(state, action: PayloadAction<{ data: any[] }>) {
      state.isFetchingData = false;
      state.suportedIcons = action.payload.data || [];
    },
    fetchedPaymentIcosData(state, action: PayloadAction<{ data: any[] }>) {
      state.isFetchingData = false;
      state.suportedIcons = action.payload.data || [];
    },

    contactFetchingFailed(state, action: PayloadAction<any>) {
      state.isFetchingData = false;
      state.error = action.payload.error;
    },
    socialIconsFetchingFailed(state, action: PayloadAction<any>) {
      state.isFetchingData = false;
      state.error = action.payload.error;
    },
    paymentnIconsFetchingFailed(state, action: PayloadAction<any>) {
      state.isFetchingData = false;
      state.error = action.payload.error;
    },
    adding(state) {
      state.isSubmitting = true;
    },

    uploadingImage(state) {
      state.isUploadingImage = true;
    },

    uploadingImageDone(state) {
      state.isUploadingImage = false;
    },

    uploadingImageFailed(state, action: PayloadAction<any>) {
      state.isUploadingImage = false;
      state.error = action.payload.error;
    },

    addingDone(state) {
      state.isSubmitting = false;
    },

    addingFailed(state, action: PayloadAction<any>) {
      state.isSubmitting = false;
      state.error = action.payload.error;
    },

    updateStatus(state, action: PayloadAction<any>) {
      state.status = action.payload.status;
      state.message = action.payload.message;
    },

    resetStatus(state) {
      state.status = "";
      state.message = "";
    },
  },
});

export const {
  fetching,
  adding,
  uploadingImage,
  uploadingImageDone,
  uploadingImageFailed,
  addingDone,
  addingFailed,
  updateStatus,
  resetStatus,
  fetchedContactsData,
  contactFetchingFailed,
  socialIconsFetchingFailed,
  fetchedSocialIcosData,
  paymentnIconsFetchingFailed,
  fetchedPaymentIcosData,
} = homeslice.actions;

export default homeslice.reducer;
