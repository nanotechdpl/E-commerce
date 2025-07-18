"use client";

import Sidebar from "@/components/email/EmailSidebar";
import React, { useState } from "react";
import {
  AiOutlineLink,
  AiOutlinePaperClip,
  AiOutlineSearch,
} from "react-icons/ai";

interface Draft {
  id: number;
  sender: string;
  subject: string;
  content: string;
  time: string;
  attachments: string[];
}

const draftsData: Draft[] = [
  {
    id: 1,
    sender: "Toseline Brank",
    subject: "Drafts....",
    content: "Hello Ma/sir",
    time: "9:54PM",
    attachments: ["document.pdf", "image.png"],
  },
];

const DraftsPage: React.FC = () => {
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("Draft");

  const handleContinueTyping = (draft: Draft) => {
    setSelectedDraft(draft);
    setIsEditing(true);
  };

  const handleSaveDraft = () => {
    // Logic to save draft (e.g., API call)
    setIsEditing(false);
  };

  const handleDeleteDraft = () => {
    setSelectedDraft(null);
    setIsEditing(false);
  };

  const handleAttachFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && selectedDraft) {
      const file = e.target.files[0];
      const updatedAttachments = [...selectedDraft.attachments, file.name];
      setSelectedDraft({ ...selectedDraft, attachments: updatedAttachments });
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="w-1/3 bg-gray-100 p-4 bg-[#EAEAEA]">
        <div className="flex items-center gap-3 mb-4 p-2 bg-white shadow-md rounded-lg">
          <AiOutlineSearch size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="search text"
            className="flex-grow outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
        <div className="h-[2px] bg-gray-600 mx-4 mb-6"></div>
        <h2 className="text-lg font-semibold mb-4">Drafts</h2>
        {draftsData.map((draft) => (
          <div
            key={draft.id}
            className="p-4 bg-white shadow-md rounded-lg mb-2 cursor-pointer"
            onClick={() => setSelectedDraft(draft)}
          >
            <div className="flex justify-between">
              <span className="font-medium">{draft.sender}</span>
              <span className="text-sm text-gray-500">{draft.time}</span>
            </div>
            <p className="text-sm text-gray-700">{draft.subject}</p>
          </div>
        ))}
      </div>

      {/* Draft Detail */}
      <div className="w-2/3 bg-white p-6 flex flex-col">
        {selectedDraft && !isEditing && (
          <div>
            <h3 className="text-lg font-medium mb-4">{selectedDraft.sender}</h3>
            <p className="text-gray-700 mb-4">{selectedDraft.content}</p>
            <button
              onClick={() => handleContinueTyping(selectedDraft)}
              className="text-blue-500 underline mr-4"
            >
              Continue typing
            </button>
            <button
              onClick={handleDeleteDraft}
              className="text-red-500 underline"
            >
              Delete the email
            </button>
          </div>
        )}

        {isEditing && selectedDraft && (
          <div className="flex flex-col h-full">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Message
              </label>
              <input
                type="text"
                value={selectedDraft.sender}
                onChange={(e) =>
                  setSelectedDraft({ ...selectedDraft, sender: e.target.value })
                }
                className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 p-1"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={selectedDraft.subject}
                onChange={(e) =>
                  setSelectedDraft({
                    ...selectedDraft,
                    subject: e.target.value,
                  })
                }
                className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 p-1"
              />
            </div>
            <div className="mb-4 flex flex-col flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachments
              </label>
              <ul className="text-xs text-gray-500 mb-2">
                {selectedDraft.attachments.map((attachment, index) => (
                  <li key={index}>{attachment}</li>
                ))}
              </ul>
              <label className="block text-sm font-medium text-gray-700 mb-1"></label>
              <textarea
                value={selectedDraft.content}
                onChange={(e) =>
                  setSelectedDraft({
                    ...selectedDraft,
                    content: e.target.value,
                  })
                }
                className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 p-1 flex-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleSaveDraft}
                className="bg-[#ffb200] text-black px-4 py-2 rounded-md"
              >
                Save
              </button>
              <label
                htmlFor="attach-file"
                className="cursor-pointer text-gray-500 hover:text-gray-700"
              >
                <AiOutlinePaperClip size={24} />
              </label>
              <input
                id="attach-file"
                type="file"
                className="hidden"
                onChange={handleAttachFile}
              />
              <button className="text-gray-500 hover:text-gray-700">
                <AiOutlineLink size={24} />
              </button>
            </div>
          </div>
        )}

        {!selectedDraft && (
          <div className="flex flex-col items-center justify-center bg-white text-gray-500 text-center">
            <h2>You dont have any saved drafts.</h2>
            <p>
              Saving a draft allows you to keep a message you arent ready to
              send yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftsPage;
