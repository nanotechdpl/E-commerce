import { createSlice } from "@reduxjs/toolkit";

export type TMessage = {
  id: string;
  sender: string;
  text: string;
  status: string;
};
export type TUser = {
  id: string;
  img: string;
  name: string;
  day: string;
  status: string;
  lastMesg: string;
  messages: TMessage[];
};
const initialState = {
  allUsers: [
    {
      id: "1",
      img: "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg",
      name: "John Smith",
      day: "Tue",
      lastMesg: "hello",
      status: "all_users",
      messages: [
        {
          id: "msg1",
          sender: "John Doe",
          text: "Hey, how's it going?",
          status: "default",
        },
        {
          id: "msg2",
          sender: "You",
          text: "Hi! I'm doing well, thanks. How about you?",
          status: "default",
        },
        {
          id: "msg3",
          sender: "John Doe",
          text: "I'm good too. What have you been up to lately?",
          status: "default",
        },
        {
          id: "msg4",
          sender: "You",
          text: "Just been busy with work and some personal projects.",
          status: "default",
        },
        {
          id: "msg5",
          sender: "John Doe",
          text: "I might go see a movie with friends. Do you have any movie recommendations?",
          status: "default",
        },
      ],
    },
    {
      id: "2",
      img: "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg",
      name: "Emma",
      day: "Tue",
      status: "all_users",
      lastMesg: "How are you",
      messages: [
        {
          id: "msg6",
          sender: "John Doe",
          text: "Hey, how's it going?",
          status: "default",
        },
        {
          id: "msg7",
          sender: "You",
          text: "Hi! I'm doing well, thanks. How about you?",
          status: "default",
        },
        {
          id: "msg8",
          sender: "John Doe",
          text: "I'm good too. What have you been up to lately?",
          status: "default",
        },
        {
          id: "msg9",
          sender: "You",
          text: "Just been busy with work and some personal projects.",
          status: "default",
        },
        {
          id: "msg10",
          sender: "John Doe",
          text: "Sounds productive! Any exciting plans for the weekend?",
          status: "default",
        },
        {
          id: "msg11",
          sender: "You",
          text: "Not really, just planning to relax at home. How about you?",
          status: "default",
        },
        {
          id: "msg12",
          sender: "John Doe",
          text: "I might go see a movie with friends. Do you have any movie recommendations?",
          status: "default",
        },
      ],
    },
    {
      id: "3",
      img: "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg",
      name: "john",
      day: "Tue",
      status: "all_users",
      lastMesg: "Emma send 6 Photos",
      messages: [
        {
          id: "msg13",
          sender: "John Doe",
          text: "Hey, how's it going?",
          status: "default",
        },
        {
          id: "msg14",
          sender: "You",
          text: "Hi! I'm doing well, thanks. How about you?",
          status: "default",
        },
        {
          id: "msg15",
          sender: "John Doe",
          text: "I'm good too. What have you been up to lately?",
          status: "default",
        },
        {
          id: "msg16",
          sender: "You",
          text: "Just been busy with work and some personal projects.",
          status: "default",
        },
        {
          id: "msg17",
          sender: "John Doe",
          text: "Sounds productive! Any exciting plans for the weekend?",
          status: "default",
        },
      ],
    },
    {
      id: "4",
      img: "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg",
      name: "john",
      day: "Tue",
      status: "all_users",
      lastMesg: "Emma send 6 Photos",
      messages: [
        {
          id: "msg18",
          sender: "John Doe",
          text: "Hey, how's it going?",
          status: "default",
        },
        {
          id: "msg19",
          sender: "You",
          text: "Hi! I'm doing well, thanks. How about you?",
          status: "default",
        },
        {
          id: "msg20",
          sender: "John Doe",
          text: "I'm good too. What have you been up to lately?",
          status: "default",
        },
        {
          id: "msg21",
          sender: "You",
          text: "Just been busy with work and some personal projects.",
          status: "default",
        },
      ],
    },
    {
      id: "5",
      img: "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg",
      name: "john",
      day: "Tue",
      status: "all_users",
      lastMesg: "Emma send 6 Photos",
      messages: [
        {
          id: "msg22",
          sender: "John Doe",
          text: "Hey, how's it going?",
          status: "default",
        },
        {
          id: "msg23",
          sender: "You",
          text: "Hi! I'm doing well, thanks. How about you?",
          status: "default",
        },
        {
          id: "msg24",
          sender: "John Doe",
          text: "I'm good too. What have you been up to lately?",
          status: "default",
        },
        {
          id: "msg25",
          sender: "You",
          text: "Just been busy with work and some personal projects.",
          status: "default",
        },
        {
          id: "msg26",
          sender: "John Doe",
          text: "Sounds productive! Any exciting plans for the weekend?",
          status: "default",
        },
        {
          id: "msg27",
          sender: "You",
          text: "Not really, just planning to relax at home. How about you?",
          status: "default",
        },
        {
          id: "msg28",
          sender: "John Doe",
          text: "I might go see a movie with friends. Do you have any movie recommendations?",
          status: "default",
        },
      ],
    },
    {
      id: "6",
      img: "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg",
      name: "john",
      day: "Tue",
      status: "all_users",
      lastMesg: "Emma send 6 Photos",
      messages: [
        {
          id: "msg29",
          sender: "John Doe",
          text: "Hey, how's it going?",
          status: "default",
        },
        {
          id: "msg30",
          sender: "You",
          text: "Hi! I'm doing well, thanks. How about you?",
          status: "default",
        },
        {
          id: "msg31",
          sender: "John Doe",
          text: "I'm good too. What have you been up to lately?",
          status: "default",
        },
        {
          id: "msg32",
          sender: "You",
          text: "Just been busy with work and some personal projects.",
          status: "default",
        },
      ],
    },
  ],
  requesteUsers: [
    {
      id: "1",
      img: "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg",
      name: "John Smith",
      day: "Tue",
      lastMesg: "hello",
      status: "requeste_users",
      messages: [
        {
          id: "msg1",
          sender: "John Doe",
          text: "Hey, how's it going?",
          status: "default",
        },
        {
          id: "msg2",
          sender: "You",
          text: "Hi! I'm doing well, thanks. How about you?",
          status: "default",
        },
        {
          id: "msg3",
          sender: "John Doe",
          text: "I'm good too. What have you been up to lately?",
          status: "default",
        },
        {
          id: "msg4",
          sender: "You",
          text: "Just been busy with work and some personal projects.",
          status: "default",
        },
        {
          id: "msg5",
          sender: "John Doe",
          text: "I might go see a movie with friends. Do you have any movie recommendations?",
          status: "default",
        },
      ],
    },
    {
      id: "2",
      img: "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg",
      name: "Emma",
      day: "Tue",
      status: "requeste_users",
      lastMesg: "How are you",
      messages: [
        {
          id: "msg6",
          sender: "John Doe",
          text: "Hey, how's it going?",
          status: "default",
        },
        {
          id: "msg7",
          sender: "You",
          text: "Hi! I'm doing well, thanks. How about you?",
          status: "default",
        },
        {
          id: "msg8",
          sender: "John Doe",
          text: "I'm good too. What have you been up to lately?",
          status: "default",
        },
        {
          id: "msg9",
          sender: "You",
          text: "Just been busy with work and some personal projects.",
          status: "default",
        },
        {
          id: "msg10",
          sender: "John Doe",
          text: "Sounds productive! Any exciting plans for the weekend?",
          status: "default",
        },
        {
          id: "msg11",
          sender: "You",
          text: "Not really, just planning to relax at home. How about you?",
          status: "default",
        },
        {
          id: "msg12",
          sender: "John Doe",
          text: "I might go see a movie with friends. Do you have any movie recommendations?",
          status: "default",
        },
      ],
    },
    {
      id: "3",
      img: "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg",
      name: "john",
      day: "Tue",
      status: "requeste_users",
      lastMesg: "Emma send 6 Photos",
      messages: [
        {
          id: "msg13",
          sender: "John Doe",
          text: "Hey, how's it going?",
          status: "default",
        },
        {
          id: "msg14",
          sender: "You",
          text: "Hi! I'm doing well, thanks. How about you?",
          status: "default",
        },
        {
          id: "msg15",
          sender: "John Doe",
          text: "I'm good too. What have you been up to lately?",
          status: "default",
        },
        {
          id: "msg16",
          sender: "You",
          text: "Just been busy with work and some personal projects.",
          status: "default",
        },
        {
          id: "msg17",
          sender: "John Doe",
          text: "Sounds productive! Any exciting plans for the weekend?",
          status: "default",
        },
      ],
    },
    {
      id: "4",
      img: "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg",
      name: "john",
      day: "Tue",
      status: "requeste_users",
      lastMesg: "Emma send 6 Photos",
      messages: [
        {
          id: "msg18",
          sender: "John Doe",
          text: "Hey, how's it going?",
          status: "default",
        },
        {
          id: "msg19",
          sender: "You",
          text: "Hi! I'm doing well, thanks. How about you?",
          status: "default",
        },
        {
          id: "msg20",
          sender: "John Doe",
          text: "I'm good too. What have you been up to lately?",
          status: "default",
        },
        {
          id: "msg21",
          sender: "You",
          text: "Just been busy with work and some personal projects.",
          status: "default",
        },
      ],
    },
  ],
  forwordRequestUsers: [
    {
      id: "1",
      img: "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg",
      name: "John Smith",
      day: "Tue",
      lastMesg: "hello",
      status: "forward_users",
      messages: [
        {
          id: "msg1",
          sender: "John Doe",
          text: "Hey, how's it going?",
          status: "default",
        },
        {
          id: "msg2",
          sender: "You",
          text: "Hi! I'm doing well, thanks. How about you?",
          status: "default",
        },
        {
          id: "msg3",
          sender: "John Doe",
          text: "I'm good too. What have you been up to lately?",
          status: "default",
        },
        {
          id: "msg4",
          sender: "You",
          text: "Just been busy with work and some personal projects.",
          status: "default",
        },
        {
          id: "msg5",
          sender: "John Doe",
          text: "I might go see a movie with friends. Do you have any movie recommendations?",
          status: "default",
        },
      ],
    },
    {
      id: "2",
      img: "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg",
      name: "Emma",
      day: "Tue",
      status: "forward_users",
      lastMesg: "How are you",
      messages: [
        {
          id: "msg6",
          sender: "John Doe",
          text: "Hey, how's it going?",
          status: "default",
        },
        {
          id: "msg7",
          sender: "You",
          text: "Hi! I'm doing well, thanks. How about you?",
          status: "default",
        },
        {
          id: "msg8",
          sender: "John Doe",
          text: "I'm good too. What have you been up to lately?",
          status: "default",
        },
        {
          id: "msg9",
          sender: "You",
          text: "Just been busy with work and some personal projects.",
          status: "default",
        },
        {
          id: "msg10",
          sender: "John Doe",
          text: "Sounds productive! Any exciting plans for the weekend?",
          status: "default",
        },
        {
          id: "msg11",
          sender: "You",
          text: "Not really, just planning to relax at home. How about you?",
          status: "default",
        },
        {
          id: "msg12",
          sender: "John Doe",
          text: "I might go see a movie with friends. Do you have any movie recommendations?",
          status: "default",
        },
      ],
    },
    {
      id: "3",
      img: "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg",
      name: "john",
      day: "Tue",
      status: "forward_users",
      lastMesg: "Emma send 6 Photos",
      messages: [
        {
          id: "msg13",
          sender: "John Doe",
          text: "Hey, how's it going?",
          status: "default",
        },
        {
          id: "msg14",
          sender: "You",
          text: "Hi! I'm doing well, thanks. How about you?",
          status: "default",
        },
        {
          id: "msg15",
          sender: "John Doe",
          text: "I'm good too. What have you been up to lately?",
          status: "default",
        },
        {
          id: "msg16",
          sender: "You",
          text: "Just been busy with work and some personal projects.",
          status: "default",
        },
        {
          id: "msg17",
          sender: "John Doe",
          text: "Sounds productive! Any exciting plans for the weekend?",
          status: "default",
        },
      ],
    },
  ],
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
});

export default userSlice.reducer;
