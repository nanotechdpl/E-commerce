"use client";
import EmailDetail from "@/components/email/EmailDetail";
import EmailList from "@/components/email/EmailList";
import React, { useState } from "react";
import Sidebar from "@/components/email/EmailSidebar";

interface Email {
  id: number;
  sender: string;
  title: string;
  preview: string;
  time: string;
  isStarred: boolean;
  senderInitial: string;
  bgColor: string;
}

const SentPage = () => {
  const [selectedEmailId, setSelectedEmailId] = useState<number | null>(null); // Track selected email ID
  const [activeTab, setActiveTab] = useState<string>("Inbox"); // Default tab is 'Inbox'

  // Sample emails
  const emails: Email[] = [
    {
      id: 1,
      sender: "Nathan Robertson",
      title: "Hangout At Richard's Home",
      preview: "Hey Senorita, Mind joining us for an hangout ton...",
      time: "6:20PM",
      isStarred: false,
      senderInitial: "N",
      bgColor: "bg-blue-500",
    },
    {
      id: 2,
      sender: "Annie Mcphee",
      title: "Hangout At Richard's Home",
      preview: "Hey Senorita, Mind joining us for an hangout ton...",
      time: "9:54PM",
      isStarred: true,
      senderInitial: "A",
      bgColor: "bg-red-500",
    },
    {
      id: 3,
      sender: "Roseline Frank",
      title: "Hangout At Richard's Home",
      preview: "Hey Senorita, Mind joining us for an hangout ton...",
      time: "6:20PM",
      isStarred: false,
      senderInitial: "R",
      bgColor: "bg-green-500",
    },
    {
      id: 4,
      sender: "Bathan Robertson",
      title: "Hangout At Richard's Home",
      preview: "Hey Senorita, Mind joining us for an hangout ton...",
      time: "6:20PM",
      isStarred: false,
      senderInitial: "B",
      bgColor: "bg-gray-500",
    },
    {
      id: 5,
      sender: "Pathan Robertson",
      title: "Hangout At Richard's Home",
      preview: "Hey Senorita, Mind joining us for an hangout ton...",
      time: "6:20PM",
      isStarred: false,
      senderInitial: "P",
      bgColor: "bg-pink-500",
    },
    {
      id: 6,
      sender: "Mathan Robertson",
      title: "Hangout At Richard's Home",
      preview: "Hey Senorita, Mind joining us for an hangout ton...",
      time: "6:20PM",
      isStarred: false,
      senderInitial: "M",
      bgColor: "bg-yellow-500",
    },
  ];

  // Find the selected email based on its ID
  const selectedEmail = emails.find((email) => email.id === selectedEmailId) || null;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Email List */}
      <div className="flex-1 overflow-y-auto border-r border-gray-200">
        <EmailList
          emails={emails}
          onSelectEmail={(id) => setSelectedEmailId(id)} // Set selected email ID
        />
      </div>

      {/* Email Detail */}
      <div className="flex-1 p-4">
        <EmailDetail email={selectedEmail} />
      </div>
    </div>
  );
};

export default SentPage;
