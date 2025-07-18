import { LiveChatManage } from "@/modules/live-chat/LiveChatManage";
import React from "react";

const page = () => {
  return (
    <div>
      <LiveChatManage />
    </div>
  );
};

export default page;

// "use client";

// import { ChatSideBar } from "@/modules/live-chat/components/ChatSideBar";
// import { SelectedChatBox } from "@/modules/live-chat/components/SelectedChatBox";
// import axiosInstance from "@/redux/axios";
// import { useAppSelector } from "@/redux/hooks/hooks";
// import Image from "next/image";
// import { useEffect, useRef, useState } from "react";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { IoArrowRedoOutline } from "react-icons/io5";
// import { VscEdit } from "react-icons/vsc";

// export interface Message {
//   id: string;
//   text: string;
//   sender: string;
//   time: string;
// }

// const [chats, setChats] = useState([
//   {
//     id: 1,
//     name: "Lisa Roy",
//     lastMessage: "Hi, are you available tomorrow?",
//     time: "10:25 AM",
//     userCancel: true,
//     callCancel: true,
//     commentCancel: true,
//   },
//   {
//     id: 2,
//     name: "Jamie Taylor",
//     lastMessage: "See you tomorrow!",
//     time: "09:48 AM",
//     userCancel: true,
//     callCancel: true,
//     commentCancel: true,
//   },
//   {
//     id: 3,
//     name: "Jason Roy",
//     lastMessage: "Looking forward to a great start.",
//     time: "08:30 AM",
//     userCancel: true,
//     callCancel: true,
//     commentCancel: true,
//   },
//   {
//     id: 4,
//     name: "Amy Frost",
//     lastMessage: "Will you start working on the project?",
//     time: "07:15 AM",
//     userCancel: true,
//     callCancel: true,
//     commentCancel: true,
//   },
//   {
//     id: 5,
//     name: "Paul Wilson",
//     lastMessage: "Send your timetable champ!",
//     time: "Yesterday",
//     userCancel: true,
//     callCancel: true,
//     commentCancel: true,
//   },
// ]);

// const ChatApp = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [message, setMessage] = useState("");
//   const [MuteStatus, setMuteStatus] = useState(false);
//   const [SoundStatus, setSoundStatus] = useState(false);

//   const [rightSetting] = useState({
//     block: false,
//     cantMessage: false,
//     cantCall: false,
//   });

//   const [settings, setSettings] = useState({
//     notification: false,
//     cantMessage: false,
//     incomingCall: false,
//   });

//   const toggleSetting = (setting: keyof typeof settings) => {
//     setSettings((prev) => ({
//       ...prev,
//       [setting]: !prev[setting],
//     }));
//   };

//   const userImage = "/images/admin-login.png";

//   const placeholderImage = "/images/user.png";

//   const handlemuteStatus = () => {
//     setMuteStatus(!MuteStatus);
//   };
//   const handleSoundStatus = () => {
//     setSoundStatus(!SoundStatus);
//   };

//   const toggleUserCancel = (id: number) => {
//     setChats((prevChats) =>
//       prevChats.map((chat) =>
//         chat.id === id ? { ...chat, userCancel: !chat.userCancel } : chat
//       )
//     );
//   };

//   const toggleCallCancel = (id: number) => {
//     setChats((prevChats) =>
//       prevChats.map((chat) =>
//         chat.id === id ? { ...chat, callCancel: !chat.callCancel } : chat
//       )
//     );
//   };

//   const toggleCommentCancel = (id: number) => {
//     setChats((prevChats) =>
//       prevChats.map((chat) =>
//         chat.id === id ? { ...chat, commentCancel: !chat.commentCancel } : chat
//       )
//     );
//   };

//   const [statusUser] = useState("");
//   const allUsers: any = useAppSelector((state) => state.users.allUsers);
//   const [usersData, setUsersData] = useState(allUsers);

//   const requestedUser = useAppSelector((state) => state.users.requesteUsers);
//   const forwardRequest = useAppSelector(
//     (state) => state.users.forwordRequestUsers
//   );

//   const userId = localStorage.getItem("userId");
//   console.log(userId);

//   const handleSenMessage = () => {
//     setMessage("");
//     setMessages((prevChats: Message[]) => [
//       ...prevChats,
//       {
//         id: new Date().toISOString(), // Convert Date to string
//         text: message,
//         sender: "you",
//         time: new Date().toISOString(), // Convert Date to string
//       },
//     ]);

//     axiosInstance
//       .post("/messages/send/user", {
//         sender: userId,
//         receiver: "U004",
//         message: message,
//       })
//       .then((res) => {
//         console.log("first", res);
//         setMessage("");
//       })
//       .catch((err) => console.log(err));
//   };

//   useEffect(() => {
//     axiosInstance
//       .get("/messages/get")
//       .then((res) => {
//         console.log("cchat", res);
//       })
//       .catch((err) => {
//         console.log("error", err);
//       });
//   }, []);

//   useEffect(() => {
//     if (statusUser === "request") {
//       setUsersData(requestedUser);
//     } else if (statusUser === "forward-request") {
//       setUsersData(forwardRequest);
//     } else if (statusUser === "all") {
//       setUsersData(allUsers);
//     }
//   }, [allUsers, forwardRequest, requestedUser, statusUser]);

//   return (
//     <div className="flex h-screen bg-white ">
//       {/* chat sidebar  */}
//       <ChatSideBar />
//       {/* selected chat one to one */}
//       <SelectedChatBox />
//     </div>
//   );
// };

// const EditButton = ({ toggleSetting, settings }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen]);

//   return (
//     <div className="flex relative items-end flex-col gap-3" ref={menuRef}>
//       <VscEdit
//         className="text-gray-600 cursor-pointer"
//         size={20}
//         onClick={() => setIsOpen(!isOpen)}
//       />

//       {isOpen && (
//         <div
//           style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
//           className="absolute right-0 top-10 flex items-start justify-end p-4 bg-white rounded-md"
//         >
//           <div className="flex flex-col text-black gap-2">
//             {[
//               { key: "notification", label: "Notification" },
//               { key: "cantMessage", label: "Can't Message" },
//               { key: "incomingCall", label: "Incoming Call" },
//             ].map(({ key, label }) => (
//               <div key={key}>
//                 <div className="flex shadow items-center justify-between gap-1 p-2 rounded-full bg-white">
//                   <span className="whitespace-nowrap">{label}</span>
//                   <label className="relative inline-flex cursor-pointer items-center">
//                     <input
//                       type="checkbox"
//                       checked={settings[key as keyof typeof settings]}
//                       onChange={() =>
//                         toggleSetting(key as keyof typeof settings)
//                       }
//                       className="peer sr-only"
//                     />
//                     <div className="peer h-6 w-11 rounded-full bg-[#bbb] after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none   rtl:peer-checked:after:-translate-x-full"></div>
//                   </label>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const ShareButtonModel = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);

//   // Close menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen]);

//   return (
//     <div className="relative" ref={menuRef}>
//       {/* Share Icon */}
//       <IoArrowRedoOutline
//         className="text-gray-600  cursor-pointer hover:text-gray-800  transition duration-200"
//         size={24}
//         title="Forward"
//         onClick={() => setIsOpen(!isOpen)}
//       />

//       {/* Dropdown Menu */}
//       {isOpen && (
//         <div
//           style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
//           className="absolute right-0 top-10 flex items-start justify-end z-50"
//         >
//           <div className="text-black min-w-[220px] rounded-lg bg-white whitespace-nowrap p-3 shadow-lg">
//             <ul className="space-y-2">
//               {[
//                 { name: "Mr Hunre", color: "bg-[#bbb]", action: "Send" },
//                 { name: "Mrs Paris", color: "bg-orange-400", action: "Send" },
//                 { name: "Mr Jack", color: "bg-[#bbb]", action: "Unsend" },
//               ].map(({ name, color, action }, index) => (
//                 <li
//                   key={index}
//                   className="flex shadow cursor-pointer items-center justify-between gap-2 px-3 py-2 rounded-[100px] bg-white  hover:bg-gray-100  transition"
//                 >
//                   <div className="flex items-center">
//                     <span className="flex h-8 w-8 items-center justify-center rounded-full p-1 text-white">
//                       <Image
//                         src={"/images/userAvatar.png"}
//                         alt="User name"
//                         width={32}
//                         height={32}
//                       />
//                     </span>
//                     <p className="px-2">{name}</p>
//                   </div>
//                   <button
//                     className={`rounded-full ${color} px-4 py-1 text-white text-sm font-semibold`}
//                   >
//                     {action}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// interface OptionsButtonModelProps {
//   rightSetting: Record<string, boolean>;
// }

// const OptionsButtonModel: React.FC<OptionsButtonModelProps> = ({
//   rightSetting,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [value, setValue] = useState(30);
//   const menuRef = useRef<HTMLDivElement>(null);

//   const handleClickOutside = (event: MouseEvent) => {
//     if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//       setIsOpen(false);
//     }
//   };

//   useEffect(() => {
//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setValue(Number(e.target.value));
//   };

//   return (
//     <div className="relative" ref={menuRef}>
//       <BsThreeDotsVertical
//         className="text-gray-600  cursor-pointer"
//         size={24}
//         title="More Options"
//         onClick={() => setIsOpen((prev) => !prev)}
//       />

//       {isOpen && (
//         <div
//           style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px" }}
//           className="absolute right-0 top-10 flex items-start justify-end px-4 py-6 bg-white rounded-md"
//         >
//           <div className="flex flex-col text-black gap-2">
//             {[
//               { key: "block", label: "Block" },
//               { key: "cantMessage", label: "Can't Message" },
//               { key: "cantCall", label: "Can't Call" },
//             ].map(({ key, label }) => (
//               <div key={key}>
//                 <div className="flex shadow items-center justify-between gap-4 p-3 rounded-full bg-white">
//                   <span className="whitespace-nowrap">{label}</span>
//                   <label className="relative inline-flex cursor-pointer items-center">
//                     <input
//                       type="checkbox"
//                       // checked={settings[key as keyof typeof settings]}
//                       // onChange={() => toggleSetting(key as keyof typeof settings)}
//                       className="peer sr-only"
//                     />
//                     <div className="peer h-6 w-11 rounded-full bg-[#bbb] after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none  rtl:peer-checked:after:-translate-x-full"></div>
//                   </label>
//                 </div>
//               </div>
//             ))}

//             <div className="flex justify-between items-center text-sm font-medium">
//               <span>Time</span>
//               <span className="text-muted-foreground">{value} min</span>
//             </div>

//             <div className="relative py-3 flex items-center justify-center">
//               <input
//                 type="range"
//                 min={0}
//                 max={60}
//                 value={value}
//                 onChange={handleChange}
//                 className="w-full h-1 bg-gray-300 rounded-full appearance-none cursor-pointer
//       [&::-webkit-slider-thumb]:appearance-none
//       [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
//       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black
//       [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gray-200
//       [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
//       [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black
//       [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-gray-200
//       focus:outline-none"
//               />
//               <div
//                 className="absolute top-1/2 left-0 h-2 bg-graydark/40 rounded-full"
//                 style={{
//                   width: `${(value / 60) * 100}%`,
//                   transform: "translateY(-50%)",
//                 }}
//               ></div>
//             </div>

//             <div className="text-sm text-muted-foreground">
//               Message deletion time
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// /* <CallDaillingModal
//         isVisible={isDailed}
//         onClose={setIsDailed}
//         className="mt-6 "
//       >
//         <div className=" flex h-72 w-64 flex-col items-center justify-between rounded p-2 text-black  md:mt-3">
//           <div className="mt-3 flex flex-col items-center gap-y-3">
//             <div className="rounded-full">
//               <Image
//                 src={placeholderImage}
//                 alt="callerpicture"
//                 width={50}
//                 height={30}
//               />
//             </div>
//             <div className="mt-1 text-xl">David Evle</div>
//             <div className="flex w-full items-center justify-center gap-2 text-sm font-semibold  ">
//               <p>11 :</p> <p>39 :</p> <p>12</p>
//             </div>
//           </div>

//           <div className="mt-4 flex justify-center gap-5 space-x-4  ">
//             <button
//               className="rounded-full bg-blue-500 px-3.5 py-3.5 text-white"
//               onClick={handlemuteStatus}
//             >
//               {MuteStatus ? <IoMdMicOff size={20} /> : <IoMdMic size={20} />}
//             </button>
//             <button
//               className="rounded-full bg-rose-500 px-3.5 py-3.5 text-white"
//               onClick={() => setIsDailed(false)}
//             >
//               <MdCallEnd size={20} />
//             </button>
//             <button
//               className="rounded-full bg-blue-500 px-3.5 py-3.5 text-white"
//               onClick={handleSoundStatus}
//             >
//               {SoundStatus ? (
//                 <HiMiniSpeakerXMark size={20} />
//               ) : (
//                 <HiMiniSpeakerWave size={20} />
//               )}
//             </button>
//           </div>
//         </div>
//       </CallDaillingModal> */

// export default ChatApp;
