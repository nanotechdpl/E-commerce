"use client";

// import { useState } from "react";

const ChatLineYou = ({
  chat,
}: {
  chat: { role: string; message: string; time?: string };
}) => {
  // const [isOpen, setIsOpen] = useState(false);
  return (
    <div className=" flex items-center justify-end gap-1 mt-3">
      <div>
        <button className="bg-[#2A56EBE5] rounded-tl-[101px] rounded-tr-[95px] rounded-br-[5px] rounded-bl-[101px] py-1 px-3">
          {chat.message}
        </button>
        <p className="text-xs text-gray-400 flex justify-end">{chat.time}</p>
      </div>
    </div>
  );
};

export default ChatLineYou;
