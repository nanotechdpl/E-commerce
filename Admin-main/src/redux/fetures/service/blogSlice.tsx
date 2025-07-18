import { createSlice } from "@reduxjs/toolkit";
export interface Blog {
  _id?: string;
  photo: string | null;
  title: string;
  description: string;
  tag?: string;
  status?: string;
  isDeleted: boolean;
}

interface BlogState {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  blogs: [],
  loading: false,
  error: null,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setBlogs: (state, action) => {
      state.blogs = action.payload;
    },
    addBlog: (state, action) => {
      state.blogs.push(action.payload);
    },
    updateBlog: (state, action) => {
      state.blogs = state.blogs.map((item) =>
        item._id === action.payload._id ? action.payload : item
      );
    },
    deleteBlog: (state, action) => {
      state.blogs = state.blogs.filter((item) => item._id !== action.payload);
    },
  },
});

export const { setBlogs, addBlog, updateBlog, deleteBlog } = blogSlice.actions;
export default blogSlice.reducer;