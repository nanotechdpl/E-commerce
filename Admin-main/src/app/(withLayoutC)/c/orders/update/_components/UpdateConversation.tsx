"use client";
import { useState } from "react";

import Image from "next/image";
import { FaFileUpload, FaMicrophone } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { VscChromeMinimize } from "react-icons/vsc";

// import { Poppins } from "next/font/google";

import CallPopUp from "../../_components/CallPopUp";
// import ChatLineSender from "../../_components/ChatLineSender";
// import ChatLineYou from "../../_components/ChatLineYou";
// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["600"],
// });

interface UpdateConversationProps {
  isOpen: boolean;
  setIsChatModalOpen: (value: boolean) => void; // Set chat modal open as a function accepting a boolean
}

const UpdateConversation = ({
  isOpen,
  setIsChatModalOpen,
}: UpdateConversationProps) => {
  // const [isShowChats, setIsShowChats] = useState(false);
  const [isCallPopUp, setICallPopUp] = useState(false);
  // const [isSettingOn, setIsSettingOn] = useState(false);
  const [minimise, setMinimise] = useState(false);

  const handleMinimize = () => {
    setIsChatModalOpen(false); // Close the chat modal
    setMinimise(true); // Set minimized state
  };

  const handleCall = () => {
    setIsChatModalOpen(false); // Close the chat modal
    setMinimise(true);
    setICallPopUp(true);
    // Set minimized state
  };

  const [isModalClose, setIsModalClose] = useState(false);
  const onClose = () => {
    //setIsModalClose(true);  // Open the modal when chat is closed
    setIsChatModalOpen(false);
  };

  return (
    <>
      {/* {isOpen && !minimise && ( */}
      {isOpen && !isModalClose && !minimise && (
        <div className="fixed bottom-0 right-0 m-4 w-[350px] h-[450px] bg-white rounded-xl shadow-lg z-50">
          {/* Top Section */}
          <div className="flex items-center justify-between bg-[#FFB200F2] p-3 rounded-t-xl">
            <div className="flex items-center gap-2 relative">
              <Image
                src="/images/user.png"
                height={40}
                width={40}
                className="rounded-full"
                alt="User"
              />
              <span className="absolute top-0 right-[115px] w-3 h-3 bg-[#08D304] rounded-full"></span>
              <span className="font-semibold text-[#231F20]">Richard Poon</span>
            </div>
            <div className="flex gap-2">
              <Image
                onClick={handleCall}
                src="/images/fcall.png"
                height={10}
                width={20}
                alt="call"
              />
              <span className="rounded-full">
                <VscChromeMinimize
                  onClick={handleMinimize}
                  className="cursor-pointer font-bold text-[#080202] text-2xl"
                />
              </span>
              <span className="rounded-full">
                <button
                  onClick={onClose}
                  className="text-[#080202]"
                  aria-label="Close chat"
                >
                  <IoClose size={24} />
                </button>
              </span>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex flex-col justify-between h-[calc(100%-72px)] bg-[#ECEEF1] p-4 rounded-b-xl">
            {/* Messages */}
            <div className="flex-grow h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-300">
              {/* TODO: chats data missing */}
              {/* {Chats.map((chat, index) =>
                chat.role === "you" ? (
                  <ChatLineYou key={index} chat={chat} />
                ) : (
                  <ChatLineSender key={index} chat={chat} />
                )
              )} */}
            </div>

            <div className="relative  flex items-center justify-center gap-1 px-2 py-10 mx-auto">
              <input
                type="text"
                placeholder="Send a Message"
                className="w-full bg-white px-10 py-2 rounded-lg border-[#B9B9B9] text-black outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              />
              {/* mic.png */}
              {/* Microphone Icon */}
              <FaMicrophone className="absolute left-1 top-1/2 transform -translate-y-1/2 cursor-pointer text-meta-5 text-xl" />

              {/* File Upload Icon */}
              <FaFileUpload className="absolute left-6 top-1/2 transform -translate-y-1/2 cursor-pointer text-meta-5 text-xl" />

              {/* Send Button */}
              <IoIosSend className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl" />
            </div>
          </div>

          {/* Settings */}
          {/* {isSettingOn && <ChatSettings />} */}
        </div>
      )}

      {/* {minimise*/}
      {minimise && (
        <div
          // onClick={() => [setICallPopUp(true),
          //  setMinimise(false)]}
          // onClick={() => [setMinimise(false)]}
          className="fixed bottom-5 right-10 z-40 cursor-pointer"
        >
          <div className="relative">
            {/* Notification Badge */}
            <span className="absolute bottom-8 left-11 flex h-5 w-5 items-center justify-center rounded-full bg-transparent border-2 border-black text-black font-semibold">
              1
            </span>

            {/* Image */}
            <Image
              src="/default-avatar.png"
              height={50}
              width={50}
              alt="user"
              className="rounded-full border-2 border-[#FFB200F2]"
              onClick={() => {
                setIsChatModalOpen(true);
                setMinimise(false);
              }}
            />
          </div>
        </div>
      )}

      {isCallPopUp && (
        <CallPopUp
          isCallPopUp={isCallPopUp}
          setICallPopUp={setICallPopUp}
          setMinimise={setMinimise}
        />
      )}
      {/* Modal when chat is closed */}
      {isModalClose && (
        <div className="fixed bottom-0 right-2 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-[#ECEEF1] p-4 rounded-lg shadow-lg text-center">
            {/* <Image
                src={feedback}
                height={120}
                width={120}
                alt="user"
                className="mx-auto"
              /> */}
            <h2 className="text-xl mt-2 font-bold">Did we help you?</h2>
            <h1 className="text-xl mt-2 font-bold">Your Feedback Matters</h1>
            <h3 className="mt-2 ">
              Have you benefited from the
              <span className="block"> services you received from us?</span>
            </h3>
            <div className="flex gap-6 p-4">
              <button
                onClick={() => {
                  setIsModalClose(false); // Close the "Chat Closed" modal
                  setIsChatModalOpen(false); // Close the chat modal as well
                }}
                className=" bg-[#F5271E] text-white rounded px-10 py-1"
              >
                NO
              </button>

              <button
                onClick={() => {
                  setIsModalClose(false); // Close the "Chat Closed" modal
                  setIsChatModalOpen(false); // Close the chat modal as well
                }}
                className=" bg-[#009933] text-white rounded px-10 py-1"
              >
                YES
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateConversation;
