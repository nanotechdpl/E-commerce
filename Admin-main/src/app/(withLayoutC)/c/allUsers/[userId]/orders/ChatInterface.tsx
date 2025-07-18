import {
  File,
  Mic,
  Minus,
  MoreVertical,
  Phone,
  PhoneOff,
  Send,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import avator from "../../../../../../../public/default-avatar.png";

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

interface SettingProps {
  onClose: () => void;
  settings: {
    block: boolean;
    cantMessage: boolean;
    cantCall: boolean;
    deletionDays: number;
  };
  onSettingChange: any;
}

interface CallingModalProps {
  onClose: () => void;
  userName: string;
  userImage: any;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  enabled,
  onChange,
  label,
}) => {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${
          enabled ? "bg-green-500" : "bg-[#787a79]" // Updated the off state color
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

const SettingsModal: React.FC<SettingProps> = ({
  onClose,
  settings,
  onSettingChange,
}) => (
  <div className="absolute right-0 top-12 w-72 bg-white rounded-lg shadow-lg p-4 z-50">
    <div className="border border-dashed mb-2">
      <div className="p-3">
        <div className="flex justify-between items-start mb-4">
          <button
            onClick={onClose}
            className="absolute right-2 top-2 p-[4%] text-gray-500 hover:text-gray-700"
          >
            <X size={16} fill="currentColor" />
          </button>
        </div>
        <div className="flex rounded-2xl shadow-lg px-2 justify-between items-center mb-6">
          <span className="text-lg font-medium">Block</span>
          <ToggleSwitch
            label=""
            enabled={settings.block}
            onChange={(value) => onSettingChange("block", value)}
          />
        </div>
        <div className="flex rounded-2xl shadow-lg px-2 justify-between items-center mb-6">
          <span className="text-lg font-medium">{"Can't message"}</span>
          <ToggleSwitch
            label=""
            enabled={settings.cantMessage}
            onChange={(value) => onSettingChange("cantMessage", value)}
          />
        </div>
        <div className="flex rounded-2xl shadow-lg px-2 justify-between items-center mb-6">
          <span className="text-lg font-medium">{"Can't call"}</span>
          <ToggleSwitch
            label=""
            enabled={settings.cantCall}
            onChange={(value) => onSettingChange("cantCall", value)}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Day</span>
            <span className="text-sm text-gray-500">0-100</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.deletionDays}
            onChange={(e) =>
              onSettingChange("deletionDays", parseInt(e.target.value))
            }
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-sm text-gray-500">Message deletion Day</p>
        </div>
      </div>
    </div>
  </div>
);

const CallingModal: React.FC<CallingModalProps> = ({
  onClose,
  userName,
  userImage,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
    <div className="bg-white rounded-2xl shadow-lg w-[320px] p-8 flex flex-col items-center relative z-50">
      <p className="text-green-500 text-lg mb-6">Calling.....</p>

      <div className="relative mb-4">
        <Image
          src={userImage}
          alt={userName}
          width={96}
          height={96}
          className="rounded-full"
        />
      </div>

      <h2 className="text-xl font-semibold mb-1">{userName}</h2>
      <p className="text-gray-500 mb-8">web dev</p>

      <div className="flex items-center gap-6">
        {/* Decline Call Button */}
        <button
          onClick={onClose}
          className="w-12 h-12 bg-red rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </button>

        {/* Accept Call Button */}
        <button
          onClick={onClose}
          className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
        >
          <Phone className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  </div>
);
const ChatInterface = ({ triggerLabel = "Message" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isCallingModalOpen, setIsCallingModalOpen] = useState(false);
  const [settingsState, setSettingsState] = useState({
    block: false,
    cantMessage: false,
    cantCall: false,
    deletionDays: 50,
  });
  const [messages, setMessages] = useState([
    {
      text: "Are you being serious about the consent form?",
      sender: "them",
      time: "8:03 PM",
    },
    { text: "Is that an issue?", sender: "you", time: "8:03 PM" },
    {
      text: "Are you being serious? Because this is weird then",
      sender: "them",
      time: "8:05 PM",
    },
    {
      text: "We're never going to have sex. We can be friends though.",
      sender: "you",
      time: "8:09 PM",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSettingChange = (setting: any, value: any) => {
    setSettingsState((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const newMessage = {
      text: inputMessage,
      sender: "you",
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setIsMinimized(false);
  };

  const handleCallClick = (e: any) => {
    e.stopPropagation();
    if (!settingsState.cantCall) {
      setIsCallingModalOpen(true);
      // Close the chat interface
      setIsModalOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-md bg-[#FFB200] px-3 py-1 text-black transition-all hover:bg-black hover:text-white"
      >
        {triggerLabel}
      </button>
      {/* Calling Modal */}
      {isCallingModalOpen && (
        <CallingModal
          onClose={() => setIsCallingModalOpen(false)}
          userName="Richard Poon"
          userImage={avator}
        />
      )}

      {isModalOpen && (
        <>
          {!isMinimized ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                onClick={handleClose}
              />
              <div className="bg-white rounded-2xl shadow-lg w-[400px] h-[475px] flex flex-col relative z-50">
                {/* Header */}
                <div className="bg-[#FFB200] p-3 flex items-center justify-between flex-shrink-0 rounded-t-2xl">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src={avator}
                        alt="user avatar"
                        width={36}
                        height={36}
                        className="rounded-full shadow-xl"
                      />
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#FFB200]"></div>
                    </div>
                    <span className="font-semibold text-black">
                      Richard Poon
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleCallClick}
                      className={`text-black hover:text-gray-700 ${
                        settingsState.cantCall
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      disabled={settingsState.cantCall}
                    >
                      <Phone className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="text-black hover:text-gray-700"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleMinimize}
                      className="text-black hover:text-gray-700"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleClose}
                      className="text-black hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {showSettings && (
                  <SettingsModal
                    onClose={() => setShowSettings(false)}
                    settings={settingsState}
                    onSettingChange={handleSettingChange}
                  />
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-[#e3e3e3] custom-scrollbar">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-6 flex ${
                        message.sender === "you"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div className="flex flex-col gap-1 max-w-[280px]">
                        <div
                          className={`rounded-2xl px-4 py-2.5 ${
                            message.sender === "you"
                              ? "bg-[#0066FF] text-white rounded-br-sm"
                              : "bg-[#FFB200] text-black rounded-bl-sm"
                          }`}
                        >
                          <p className="text-sm leading-snug">{message.text}</p>
                        </div>
                        <span
                          className={`text-xs text-gray-400 ${
                            message.sender === "you"
                              ? "text-right pr-1"
                              : "text-left pl-1"
                          }`}
                        >
                          {message.time}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 rounded-b-2xl bg-[#e3e3e3] flex-shrink-0">
                  <div className="flex bg-white border bg-grey-50 items-center gap-3 bg-gray-50 rounded-full px-4 py-2.5">
                    <File className="text-gray-400 cursor-pointer w-5 h-5" />
                    <Mic className="text-gray-400 cursor-pointer w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Send a Message"
                      className="flex-1 text-sm bg-transparent focus:outline-none"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      disabled={settingsState.cantMessage}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage(e)
                      }
                    />
                    <Send
                      className="text-black cursor-pointer w-5 h-5"
                      onClick={handleSendMessage}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
              <div
                className="bg-[#FFB200] rounded-full p-2 shadow-lg flex items-center gap-2 cursor-pointer"
                onClick={handleMaximize}
              >
                <div className="relative">
                  <Image
                    src={avator}
                    alt="user avatar"
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#FFB200]"></div>
                </div>
                <span className="font-semibold text-black pr-2">
                  Richard Poon
                </span>
              </div>
              <button
                onClick={handleClose}
                className="bg-[#FFB200] rounded-full p-2 shadow-lg hover:bg-[#e6a100] transition-colors"
              >
                <X className="w-4 h-4 text-black" />
              </button>
            </div>
          )}
        </>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: black;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #666;
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
