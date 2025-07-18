import { useState } from "react";

const ChatLineSender = ({
  chat,
}: {
  chat: { role: string; message: string; time?: string };
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex items-center justify-start gap-1">
      <div>
        <button className="bg-[#FFB200E5] rounded-tl-[95px] rounded-tr-[101px] rounded-br-[101px] rounded-bl-[5px] py-1 px-3 text-left">
          {chat.message}
        </button>
        <p className="text-xs text-gray-400">{chat.time}</p>
      </div>
    </div>
  );
};

export default ChatLineSender;
