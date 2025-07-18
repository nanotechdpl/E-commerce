"use client";

import React from "react";
import {
  AiOutlinePrinter,
  AiOutlineShareAlt,
  AiOutlineStar,
  AiFillStar,
} from "react-icons/ai";
import { BiDotsHorizontalRounded } from "react-icons/bi";

type EmailDetailProps = {
  email: {
    id: number;
    sender: string;
    subject: string;
    body: string;
    time: string;
    starred: boolean;
    avatarColor: string;
    initial: string;
    venue: string;
    timeDetails: string;
  } | null;
};

const EmailDetail = ({ email }: EmailDetailProps) => {
  if (!email) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        <div className="flex flex-col p-6 justify-center items-center h-40 w-70 bg-white">
          <h2>You dont have any selected Mail.</h2>
          <br />
          <p>Click on an item to view it</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg mx-auto max-w-3xl h-auto mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-semibold ${email.avatarColor}`}
          >
            {email.initial}
          </div>
          <div className="ml-4">
            <p className="font-semibold text-gray-900">{email.sender}</p>
            <p className="text-sm text-gray-500">{email.subject}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <AiOutlinePrinter
            size={20}
            className="text-gray-600 cursor-pointer"
          />
          <AiOutlineShareAlt
            size={20}
            className="text-gray-600 cursor-pointer"
          />
          <BiDotsHorizontalRounded
            size={20}
            className="text-gray-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Title */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold text-gray-900">{email.subject}</h1>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-500">{email.time}</p>
          <div
            className="cursor-pointer"
            onClick={() => {
              email.starred = !email.starred;
            }}
          >
            {email.starred ? (
              <AiFillStar size={20} className="text-yellow-500" />
            ) : (
              <AiOutlineStar size={20} className="text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="text-gray-800 leading-6">
        <p className="mb-4">
          Hey Senorita,
          <br />
          Hope you&apos;re doing great! Mind joining us for a hangout tonight?
          We&apos;re getting together to relax, catch up, and just have a good
          time, and it wouldn’t be the same without you.
        </p>

        <p className="mb-4">
          Here are the details:
          <br />
          <span className="flex items-center gap-2">
            📍 Venue:{" "}
            <span className="font-semibold text-gray-900">{email.venue}</span>
          </span>
          <span className="flex items-center gap-2">
            ⏰ Time:{" "}
            <span className="font-semibold text-gray-900">
              {email.timeDetails}
            </span>
          </span>
        </p>

        <p className="mb-4">
          Feel free to bring along a friend if you&apos;d like. Let me know if
          you can make it—we&apos;d love to see you there! Looking forward to
          catching up. 😊
        </p>

        <p className="mb-6">
          Best, <br />
          [Your Name]
        </p>
      </div>

      {/* Footer Links */}
      <div className="flex items-center space-x-4">
        <a href="#" className="text-blue-500 font-medium">
          Reply
        </a>
        <a href="#" className="text-blue-500 font-medium">
          Forward
        </a>
      </div>
    </div>
  );
};

export default EmailDetail;
