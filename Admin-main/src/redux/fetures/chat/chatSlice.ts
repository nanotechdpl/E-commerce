import { createSlice } from "@reduxjs/toolkit";

interface userType {
    _id: string;
    name: string;
    email: string;
}
interface messageType {
    _id: string;
    sender: string;
    receiver: string;
    text: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
}
interface conversationType {
    _id: string;
    participants: userType[];
    messages: messageType[];
    createdAt: string;
    updatedAt: string;
    lastMessageUser: string;
    lastMessage: messageType;
    isDeleted: boolean;
}

interface initialStateType {
  conversations: conversationType[],
  selectedConversation: conversationType | null,
}
const initialState: initialStateType = {
  conversations:[],
  selectedConversation: null,
};


const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
});

export default chatSlice.reducer;


