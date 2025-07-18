
  
import { createSlice } from "@reduxjs/toolkit";

export interface Notice {
  _id?: string;
  title: string;
  photo: string | null;
  visible?: string;
  date: string;
  isDeleted: boolean;
}

interface NoticeState {
  notices: Notice[];
  loading: boolean;
  error: string | null;
}

const initialState: NoticeState = {
  notices: [],
  loading: false,
  error: null,
};

const noticeSlice = createSlice({
  name: "notice",
  initialState,
  reducers: {
    setNotices: (state, action) => {
      state.notices = action.payload;
    },
    addNotice: (state, action) => {
      state.notices.push(action.payload);
    },
    updateNotice: (state, action) => {
      state.notices = state.notices.map((item) =>
        item._id === action.payload._id ? action.payload : item
      );
    },
    deleteNotice: (state, action) => {
      state.notices = state.notices.filter(
        (item) => item._id !== action.payload
      );
    },
  },
});

export const { setNotices, addNotice, updateNotice, deleteNotice } =
  noticeSlice.actions;
export default noticeSlice.reducer;


