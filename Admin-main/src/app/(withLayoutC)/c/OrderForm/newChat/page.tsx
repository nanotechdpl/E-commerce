"use client";
import React, { useState } from "react";
import { FaPhone } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { BiCheckDouble, BiTrash } from "react-icons/bi";
import { FaClock } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import Image from "next/image";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiShareForwardFill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import { MdCallEnd } from "react-icons/md";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { FaRegCircleUser } from "react-icons/fa6";
import CallDaillingModal from "@/components/ui/modal/CallDaillingModal";
import SendMessage from "@/components/Chat/SendMessage";
import Conversation from "@/components/ui/ChatComponents/Conversation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { removeMessage } from "@/redux/fetures/liveChat/chatPartnerSlice";
import { message } from "antd";


export default function Chat() {
  const [showDropManu, setShowDropManu] = useState(false);
  const [showForwartManu, setShowForwardManu] = useState(false);
  // call dialing state
  const [isDailed, setIsDailed] = useState(false);

  // mute status
  const [MuteStatus, setMuteStatus] = useState(false);
  const [SoundStatus, setSoundStatus] = useState(false);

  //redux
  const activeChat: any = useAppSelector((state) => state.chatPartner.partner);
  const dispatch = useAppDispatch();

  //copy text
  const handleCopyMessage = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.open({
          type: "success",
          content: "Message copied successfully",
        });
      })
      .catch((error) => {
        console.error("Failed to copy message:", error);
        // Handle error if copying fails
      });
  };

  const handlemuteStatus = () => {
    setMuteStatus(!MuteStatus);
  };
  const handleSoundStatus = () => {
    setSoundStatus(!SoundStatus);
  };

  const handleShowDropManu = () => {
    setShowDropManu(!showDropManu);
    setShowForwardManu(false);
  };

  const handleForwardClick = () => {
    setShowForwardManu(!showForwartManu);
  };

  const [isOpenPopUp, setIsOpenPopUp] = useState<number[]>([]);
  const toggleMenu = (index: any) => {
    if (isOpenPopUp.includes(index)) {
      setIsOpenPopUp(isOpenPopUp.filter((item) => item !== index));
    } else {
      setIsOpenPopUp([...isOpenPopUp, index]);
    }
  };


  return (
    <div className="grid w-full grid-cols-12 bg-white">
      <Conversation />
      <div className="col-span-full h-full w-full  md:col-span-8">
       
        <div className="flex items-center justify-between  border-b  border-solid  border-slate-300 px-6 py-2 ">
          <div className="item-center flex justify-between ">
            <div className=" relative mr-3 size-12">
              <Image
                src={activeChat.img}
                alt=""
                fill
                className="rounded-[50%]  "
              />
            </div>
            <div>
              <h1>{activeChat.name}</h1>
              <h1 className="text-[11px] text-slate-500 ">
                Active on Chat
              </h1>
            </div>
          </div>
          <div className="flex  gap-x-2">
            <button
              className="rounded-lg border border-solid border-slate-300 bg-slate-100  px-4 py-2 text-blue-500 shadow-lg "
              onClick={() => setIsDailed(true)}
            >
              <FaPhone />
            </button>
            <button className="rounded-lg border border-solid border-slate-300 bg-slate-100  px-4 py-2 text-blue-500 shadow-lg ">
              <FaMinus />
            </button>
            <div className="relative flex  gap-x-2">
              <button
                className="cursor-pointer rounded-lg border border-solid border-slate-300  bg-slate-300 bg-opacity-10 px-4 py-2 text-blue-500 shadow-lg  "
                onClick={handleShowDropManu}
              >
                <FiSettings />
              </button>

              {showDropManu && (
                <div className="absolute -left-60 top-10 flex items-start justify-end  ">
                  <div className="w-[300px] space-y-1 rounded-lg bg-slate-400 p-3 text-white ">
                    <div key={""}>
                      <div
                        className="relative mb-1 flex justify-between"
                        onClick={handleForwardClick}
                      >
                        <button>Forward</button>
                        <span>
                          <RiShareForwardFill  size={30} color="white" />
                        </span>
                        {showForwartManu && (
                          <div className="absolute -left-55 top-5 flex items-start justify-end  ">
                            <div className="text-balck min-w-[200px] rounded-lg bg-slate-400 p-2">
                              <ul className="space-y-3 rounded">
                                <li className="my-1 flex cursor-pointer items-center  justify-between gap-1">
                                  <div className="flex items-center">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-950 p-1 text-white">
                                      <CgProfile size={28} />
                                    </span>
                                    <p className="px-2">Mr Jack</p>
                                  </div>
                                  <button className="rounded-full bg-green-500 px-2 py-1">
                                    Send
                                  </button>
                                </li>
                                <li className="my-1 flex cursor-pointer items-center  justify-between gap-1">
                                  <div className="flex items-center">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-950 p-1 text-white">
                                      {" "}
                                      <CgProfile size={28} />
                                    </span>
                                    <p className="px-2">Mr Jack</p>
                                  </div>
                                  <button className="rounded-full bg-green-500 px-2 py-1">
                                    Send
                                  </button>
                                </li>
                                <li className="my-1 flex cursor-pointer items-center  justify-between gap-1">
                                  <div className="flex items-center">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-950 p-1 text-white">
                                      {" "}
                                      <CgProfile size={28} />
                                    </span>
                                    <p className="px-2">Mr Jack</p>
                                  </div>
                                  <button className="rounded-full bg-rose-500 px-2 py-1">
                                    unsend
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div key="text">
                      <span className="mr-5 font-medium text-white ">
                        Mute
                      </span>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          value=""
                          className="peer sr-only"
                        />
                        <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rtl:peer-checked:after:-translate-x-full"></div>
                      </label>
                    </div>
                    <div key="number">
                      <span className=" mr-5 font-medium text-white ">
                        Block
                      </span>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          value=""
                          className="peer sr-only"
                        />
                        <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rtl:peer-checked:after:-translate-x-full"></div>
                      </label>
                    </div>

                    <div key="iteration">
                      <div className="flex items-center justify-between gap-1">
                        <span>Clear All Data</span>{" "}
                        <span>
                          <BiTrash size={30} />{" "}
                        </span>
                      </div>{" "}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="h-[calc(100vh-211px)] w-full overflow-y-scroll ">
          <div className="max-h-full w-full  p-5  ">
            {activeChat.messages?.map((item: any) => {
              return item.sender === "You" ? (
                <div className="flex items-center justify-end gap-x-2">
                  <div className="relative inline-block text-left ">
                    <div>
                      <button
                        type="button"
                        id="option-manu"
                        className="roumnded-md inline-flex  w-full  justify-center rounded-full p-1 font-extrabold"
                        onClick={() => toggleMenu(item.id)}
                      >
                        <BsThreeDotsVertical size={20} />
                      </button>
                      {isOpenPopUp.includes(item.id) && (
                        <div className="absolute right-0 z-50 mt-2 w-36  origin-top-right rounded-md bg-white shadow-sm ring-1 ring-black ring-opacity-5">
                          <div
                            role="manu"
                            aria-orientation="vertical"
                            aria-labelledby="opetion-menu"
                            className="py-1"
                          >
                            <button
                              onClick={() => [
                                setIsOpenPopUp([]),
                                handleCopyMessage(item.text),
                              ]}
                              role="manuitem"
                              className="block w-full px-4 py-2 text-left  text-sm text-slate-700"
                            >
                              Copy
                            </button>
                            <button
                              onClick={() => [
                                setIsOpenPopUp([]),
                                dispatch(
                                  removeMessage({
                                    userId: activeChat.id,
                                    messageId: item.id,
                                  }),
                                ),
                              ]}
                              role="manuitem"
                              className="block w-full px-4 py-2 text-left  text-sm text-slate-700"
                            >
                              Delete
                            </button>
                          </div>{" "}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {item.status === "default" ? (
                      <h1 className="flex h-full w-full items-center justify-between gap-2 rounded-es-[2rem] rounded-se-[2rem] rounded-ss-[2rem] bg-blue-500 p-4 text-[14px] text-white ">
                        {item.text}
                        <div className="flex ">
                          <FaClock color="skyBlue" className="" />
                          <span className="text-xs">10:00</span>
                        </div>
                        <div>
                          <BiCheckDouble color="blue" />
                        </div>
                      </h1>
                    ) : (
                      <h1 className="w-full text-sm rounded-es-[2rem] rounded-se-[2rem] border-slate-600 rounded-ss-[2rem] border p-2">
                        You delete this message
                      </h1>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  key={item.id}
                  className="my-8 flex items-center justify-start gap-x-2 text-[14px] text-slate-600 "
                >
                  <Image
                    src={activeChat.img}
                    alt="img"
                    width={50}
                    height={50}
                    className="rounded-[50%]"
                  />
                  <div className="flex items-center gap-1">
                    {item.status === "default" ? (
                      <h1 className="flex h-full w-full items-center  justify-center  gap-2 rounded-full bg-slate-200 p-4  ">
                        {item.text}
                        <div className="flex ">
                          <FaClock color="skyBlue" className="" />
                          <span className="text-xs">10:00</span>
                        </div>
                        <div>
                          <BiCheckDouble color="green" />
                        </div>
                      </h1>
                    ) : (
                      <h1 className="w-full rounded-es-[2rem] rounded-se-[2rem] rounded-ss-[2rem] border p-2">
                        this message is deleted
                      </h1>
                    )}
                    <div className="relative inline-block text-left ">
                      <div>
                        <button
                          type="button"
                          id="option-manu"
                          className="roumnded-md inline-flex  w-full  justify-center rounded-full p-1 font-extrabold"
                          onClick={() => toggleMenu(item.id)}
                        >
                          <BsThreeDotsVertical size={20} />
                        </button>
                        {isOpenPopUp.includes(item.id) && (
                          <div className="absolute right-0 mt-2 w-36 origin-top-right  rounded-md bg-white shadow-sm ring-1 ring-black ring-opacity-5">
                            <div
                              role="manu"
                              aria-orientation="vertical"
                              aria-labelledby="opetion-menu"
                              className="py-1"
                            >
                              <button
                                onClick={() => [
                                  setIsOpenPopUp([]),
                                  handleCopyMessage(item.text),
                                ]}
                                role="manuitem"
                                className="block w-full px-4 py-2 text-left  text-sm text-slate-700"
                              >
                                Copy
                              </button>{" "}
                              <button
                                role="manuitem"
                                onClick={() => [
                                  setIsOpenPopUp([]),
                                  dispatch(
                                    removeMessage({
                                      userId: activeChat.id,
                                      messageId: item.id,
                                    }),
                                  ),
                                ]}
                                className="block w-full px-4 py-2 text-left  text-sm text-slate-700"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <SendMessage />
      </div>
      {/* call dailing modal */}
      <CallDaillingModal
        isVisible={isDailed}
        onClose={setIsDailed}
        className="mt-6 "
      >
        <div className=" flex h-72 w-64 flex-col items-center justify-between rounded p-2   text-white md:mt-3">
          <div className="mt-3 flex flex-col items-center gap-y-3">
            <div className="rounded-full">
              <FaRegCircleUser className=" text-6xl text-slate-500" />
            </div>
            <div className="mt-1 text-xl">David Evle</div>
            <div className="flex w-full items-center justify-center gap-2 text-sm font-semibold  ">
              <p>11 :</p> <p>39 :</p> <p>12</p>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-5 space-x-4  ">
            <button
              className="rounded-full bg-green-500 px-3.5 py-3.5 text-white"
              onClick={handlemuteStatus}
            >
              {MuteStatus ? <IoMdMicOff size={20} /> : <IoMdMic size={20} />}
            </button>
            <button
              className="rounded-full bg-rose-500 px-3.5 py-3.5 text-white"
              onClick={() => setIsDailed(false)}
            >
              <MdCallEnd size={20} />
            </button>
            <button
              className="rounded-full bg-yellow-500 px-3.5 py-3.5 text-white"
              onClick={handleSoundStatus}
            >
              {SoundStatus ? (
                <HiMiniSpeakerXMark size={20} />
              ) : (
                <HiMiniSpeakerWave size={20} />
              )}
            </button>
          </div>
        </div>
      </CallDaillingModal>
    </div>
  );
}

