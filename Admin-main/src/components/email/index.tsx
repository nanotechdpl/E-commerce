"use client"
import React, { useState } from "react";
import EmailList from "./EmailList";
import EmailDetail from "./EmailDetail";

interface Email {
  id: number;
  sender: string;
  subject: string;
  body: string;
  time: string;
  title: string;
  preview: string;
  senderInitial: string;
  bgColor: string;
  starred: boolean;
  avatarColor: string;
  initial: string;
  venue: string;
  timeDetails: string;
}

interface EmailListProps {
  emails: Email[];
  selectedEmailId: number | null;
  onSelectEmail: (id: number) => void;
}

interface EmailDetailProps {
  email: Email | null;
}

const MOCK_EMAILS: Email[] = [
  {
    id: 1,
    sender: "John Doe",
    subject: "Hello",
    body: "Hi there!",
    time: "10:00 AM",
    title: "Hello",
    preview: "Hi there!",
    senderInitial: "JD",
    bgColor: "#3C50E0",
    starred: false,
    avatarColor: "#3C50E0",
    initial: "JD",
    venue: "Office",
    timeDetails: "10:00 AM"
  },
  {
    id: 2,
    sender: "Jane Smith",
    subject: "Meeting Update",
    body: "Meeting is rescheduled",
    time: "11:00 AM",
    title: "Meeting Update",
    preview: "Meeting is rescheduled",
    senderInitial: "JS",
    bgColor: "#80CAEE",
    starred: false,
    avatarColor: "#80CAEE",
    initial: "JS",
    venue: "Conference Room",
    timeDetails: "11:00 AM"
  }
];

const EmailHome: React.FC = () => {
  const [selectedEmailId, setSelectedEmailId] = useState<number | null>(null);
  const selectedEmail = MOCK_EMAILS.find((email) => email.id === selectedEmailId);

  const handleEmailSelect = (id: number): void => {
    setSelectedEmailId(id);
  };

  return (
    <div className="flex flex-col gap-4">
      <EmailList
        emails={MOCK_EMAILS}
        selectedEmailId={selectedEmailId}
        onSelectEmail={handleEmailSelect}
      />
      <EmailDetail email={selectedEmail || null} />
    </div>
  );
};

export default EmailHome;
