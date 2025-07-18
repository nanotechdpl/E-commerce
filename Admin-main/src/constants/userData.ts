import { IUser } from "@/types/user";

export const chatData: any = [
  {
    img: "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg",
    name: "John Smith",
    day: "Tue",
    lastMesg: "hello",
    status: "request",
    messages: [
      { sender: "John Doe", text: "Hey, how's it going?" },
      { sender: "You", text: "Hi! I'm doing well, thanks. How about you?" },
      {
        sender: "John Doe",
        text: "I'm good too. What have you been up to lately?",
      },
      {
        sender: "You",
        text: "Just been busy with work and some personal projects.",
      },
      {
        sender: "John Doe",
        text: "I might go see a movie with friends. Do you have any movie recommendations?",
      },
    ],
  },
  {
    img: "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg",
    name: "Micel Smith",
    day: "Tue",
    lastMesg: "Emma send 6 Photos",
    messages: [
      { sender: "John Doe", text: "Hey, how's it going?" },
      { sender: "You", text: "Hi! I'm doing well, thanks. How about you?" },
      {
        sender: "John Doe",
        text: "I'm good too. What have you been up to lately?",
      },
      {
        sender: "You",
        text: "Just been busy with work and some personal projects.",
      },
      {
        sender: "John Doe",
        text: "Sounds productive! Any exciting plans for the weekend?",
      },
      {
        sender: "John Doe",
        text: "I might go see a movie with friends. Do you have any movie recommendations?",
      },
    ],
  },
  {
    img: "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg",
    name: "Emma",
    day: "Tue",
    status: "request",
    lastMesg: "How are you",
    messages: [
      { sender: "John Doe", text: "Hey, how's it going?" },
      { sender: "You", text: "Hi! I'm doing well, thanks. How about you?" },
      {
        sender: "John Doe",
        text: "I'm good too. What have you been up to lately?",
      },
      {
        sender: "You",
        text: "Just been busy with work and some personal projects.",
      },
      {
        sender: "John Doe",
        text: "Sounds productive! Any exciting plans for the weekend?",
      },
      {
        sender: "You",
        text: "Not really, just planning to relax at home. How about you?",
      },
      {
        sender: "John Doe",
        text: "I might go see a movie with friends. Do you have any movie recommendations?",
      },
    ],
  },
  {
    img: "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg",
    name: "john",
    day: "Tue",
    status: "block",
    lastMesg: "Emma send 6 Photos",
    messages: [
      { sender: "John Doe", text: "Hey, how's it going?" },
      { sender: "You", text: "Hi! I'm doing well, thanks. How about you?" },
      {
        sender: "John Doe",
        text: "I'm good too. What have you been up to lately?",
      },
      {
        sender: "You",
        text: "Just been busy with work and some personal projects.",
      },
      {
        sender: "John Doe",
        text: "Sounds productive! Any exciting plans for the weekend?",
      },
    ],
  },
  {
    img: "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg",
    name: "john",
    day: "Tue",
    status: "cancel",
    lastMesg: "Emma send 6 Photos",
    messages: [
      { sender: "John Doe", text: "Hey, how's it going?" },
      { sender: "You", text: "Hi! I'm doing well, thanks. How about you?" },
      {
        sender: "John Doe",
        text: "I'm good too. What have you been up to lately?",
      },
      {
        sender: "You",
        text: "Just been busy with work and some personal projects.",
      },
    ],
  },
  {
    img: "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg",
    name: "john",
    day: "Tue",
    status: "forward-request",
    lastMesg: "Emma send 6 Photos",
    messages: [
      { sender: "John Doe", text: "Hey, how's it going?" },
      { sender: "You", text: "Hi! I'm doing well, thanks. How about you?" },
      {
        sender: "John Doe",
        text: "I'm good too. What have you been up to lately?",
      },
      {
        sender: "You",
        text: "Just been busy with work and some personal projects.",
      },
      {
        sender: "John Doe",
        text: "Sounds productive! Any exciting plans for the weekend?",
      },
      {
        sender: "You",
        text: "Not really, just planning to relax at home. How about you?",
      },
      {
        sender: "John Doe",
        text: "I might go see a movie with friends. Do you have any movie recommendations?",
      },
    ],
  },
  {
    img: "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg",
    name: "john",
    day: "Tue",
    status: "cancel",
    lastMesg: "Emma send 6 Photos",
    messages: [
      { sender: "John Doe", text: "Hey, how's it going?" },
      { sender: "You", text: "Hi! I'm doing well, thanks. How about you?" },
      {
        sender: "John Doe",
        text: "I'm good too. What have you been up to lately?",
      },
      {
        sender: "You",
        text: "Just been busy with work and some personal projects.",
      },
    ],
  },
];

export const users: any[] = [
  {
    no: 1,
    _id: "U0001",
    finance: {
      total_order: 10,
      total_amount: "530 USD",
      total_paid: "20 USD",
      money_left: "300 USD",
      refund_amount: 1022,
      profit: "120 USD",
    },
    suspend: 1,
    status: "Block",
    userNumber: "",
  },
  {
    no: 2,
    _id: "U0001",
    finance: {
      total_order: 10,
      total_amount: "530 USD",
      total_paid: "20 USD",
      money_left: "300 USD",
      refund_amount: 1022,
      profit: "120 USD",
    },
    suspend: 2,
    status: "Active",
    userNumber: "",
  },
  {
    no: 3,
    _id: "U0001",
    finance: {
      total_order: 10,
      total_amount: "530 USD",
      total_paid: "20 USD",
      money_left: "300 USD",
      refund_amount: 1022,
      profit: "120 USD",
    },
    suspend: 2,
    status: "Suspend",
    userNumber: "",
  },
  {
    no: 4,
    _id: "U0001",
    finance: {
      total_order: 10,
      total_amount: "530 USD",
      total_paid: "20 USD",
      money_left: "300 USD",
      refund_amount: 1022,
      profit: "120 USD",
    },
    suspend: 2,
    status: "Block",
    userNumber: "",
  },
  {
    no: 5,
    _id: "U0001",
    finance: {
      total_order: 10,
      total_amount: "530 USD",
      total_paid: "20 USD",
      money_left: "300 USD",
      refund_amount: 1022,
      profit: "120 USD",
    },
    suspend: 2,
    status: "Active",
    userNumber: "",
  },
];

// export const users: IUser[] = [
//   {
//     userNumber: "USR001",
//     no: 1,
//     _id: "65f23a0b5d1e2b001c5f7a9d",
//     finance: {
//       total_order: 15,
//       total_amount: 5000,
//       total_paid: 4500,
//       money_left: 500,
//       refund_amount: 200,
//       profit: 800,
//     },
//     suspend: 0,
//     status: "active",
//     userUID: "abc123xyz",
//     isSuspended: "false",
//   },
//   {
//     userNumber: "USR002",
//     no: 2,
//     _id: "65f23a0b5d1e2b001c5f7a9e",
//     finance: {
//       total_order: 30,
//       total_amount: 12000,
//       total_paid: 10000,
//       money_left: 2000,
//       refund_amount: 500,
//       profit: 2500,
//     },
//     suspend: 1,
//     status: "suspended",
//     userUID: "xyz456def",
//     isSuspended: "true",
//   },
//   {
//     userNumber: "USR003",
//     no: 3,
//     _id: "65f23a0b5d1e2b001c5f7a9f",
//     finance: {
//       total_order: 8,
//       total_amount: 3000,
//       total_paid: 2800,
//       money_left: 200,
//       refund_amount: 100,
//       profit: 600,
//     },
//     suspend: 0,
//     status: "active",
//     userUID: "lmn789ghi",
//     isSuspended: "false",
//   },
// ];

export const TextEditorFormats: string[] = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "color",
];

export const TextEditorModules: unknown = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      {
        color: [
          "red",
          "blue",
          "yellow",
          "black",
          "green",
          "orange",
          "white",
          "purple",
          "grey",
          "silver",
        ],
      },
    ],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

export const services: object[] = [
  {
    id: 1,
    image:
      "https://cns-me.com/wp-content/uploads/2022/08/4.-BFSI-Services-1270x755.jpg",
    title: "Service-1",
    description: "Its new service created by service aciton",
  },
  {
    id: 2,
    image:
      "https://media.licdn.com/dms/image/D5612AQFrxg3uCB3UWg/article-cover_image-shrink_720_1280/0/1675053681748?e=2147483647&v=beta&t=AWxaXttFIpHduCdEM9JU6GLx5zfTd42vxZm5d6nOqWM",
    title: "Service-2",
    description: "Its new service created by service aciton",
  },
];

export const adminFooterItems: object[] = [
  {
    id: 1,
    title: "Office address",
    content: [
      { id: 1, title: "USA" },
      { id: 2, title: "UK" },
    ],
  },
  {
    id: 2,
    title: "Global location",
    content: [
      { id: 1, title: "Cookies" },
      { id: 2, title: "Contact" },
      { id: 3, title: "US help & support about US terms & policy return" },
      { id: 4, title: "Policy Global" },
      { id: 5, title: "Business" },
    ],
  },
  {
    id: 3,
    title: "Contact Us",
    content: [
      { id: 1, title: "Cloud Backup & Disaster" },
      { id: 2, title: "CyberSecurity" },
      { id: 3, title: "Emergency" },
      { id: 4, title: "Resources" },
      { id: 5, title: "Enterprise cloud" },
      { id: 6, title: "Service and Storge" },
      { id: 7, title: "Firewall" },
      { id: 8, title: "Solution" },
      { id: 9, title: "Ransomeware" },
      { id: 10, title: "Remediation & projection" },
      { id: 11, title: "Virtualization" },
      { id: 12, title: "Integrated " },
      { id: 13, title: "Securiy system" },
    ],
  },
  {
    id: 7,
    title: "Subsribes",
    content: [{}],
  },
  {
    id: 4,
    title: "Consulting",
    content: [
      { id: 1, title: "Acquisition" },
      { id: 2, title: "Support " },
      { id: 3, title: "Devops" },
      { id: 4, title: "Consulting" },
      { id: 5, title: "Services & solution" },
      { id: 6, title: "IT audit" },
      { id: 7, title: "Support" },
      { id: 8, title: "IT Budget" },
      { id: 9, title: "Management" },
      { id: 10, title: "IT Contract" },
      { id: 11, title: "Consulting" },
      { id: 12, title: "Managed " },
      { id: 13, title: "Services" },
      { id: 14, title: "Network Management" },
    ],
  },
  {
    id: 5,
    title: "Custom software development",
    content: [{}],
  },
  {
    id: 6,
    title: "Best it & Business solution",
    content: [{}],
  },
];
export default adminFooterItems;
