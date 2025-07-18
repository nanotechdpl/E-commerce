import { createSlice } from "@reduxjs/toolkit";


interface Contact {
    _id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    createdAt: string;
}

interface InitialStateType {
    contacts: Contact[];
    loading: boolean;
    error: string | null;
}

const initialState: InitialStateType = {
    contacts: [],
    loading: false,
    error: null
}


const contactSlice = createSlice({
    name: "contact",
    initialState,
    reducers: {
        setContacts: (state, action) => {
            state.contacts = action.payload;
        },
        addContact: (state, action) => {
            state.contacts.push(action.payload);
        },
        updateContact: (state, action) => {
            state.contacts = state.contacts.map(contact => contact._id === action.payload._id ? action.payload : contact);
        },
        deleteContact: (state, action) => {
            state.contacts = state.contacts.filter(contact => contact._id !== action.payload);
        }


    }
})

export const { setContacts, addContact, updateContact, deleteContact } = contactSlice.actions;
export default contactSlice.reducer;

