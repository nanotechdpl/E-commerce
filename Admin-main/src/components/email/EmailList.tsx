'use client';

import React from 'react';
import { AiOutlineStar, AiFillStar, AiOutlineSearch } from 'react-icons/ai';
import { usePathname } from "next/navigation"; 


interface Email {
  id: number;
  sender: string;
  title: string;
  preview: string;
  time: string;
  isStarred?: boolean;
  senderInitial: string;
  bgColor: string; 
}

interface EmailListProps {
  emails: Email[];
  selectedEmailId: number | null;
  onSelectEmail: (id: number) => void;
}




const EmailList: React.FC<EmailListProps> = ({
  emails,
  onSelectEmail,
}) => {
  const pathname = usePathname();

  const currentPage = (() => {
    const parts = pathname.split("/"); 
    const page = parts[2] || "Inbox";
    
    return page.charAt(0).toUpperCase() + page.slice(1); 
  })();

  return (
    <div className="flex flex-col h-screen p-4 bg-[#EAEAEA]">
      {/* Search Bar */}
      <div className="flex items-center gap-3 mb-4 p-2 bg-white shadow-md rounded-lg">
        <AiOutlineSearch size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="search text"
          className="flex-grow outline-none text-gray-700 placeholder-gray-400"
        />
      </div>
      <div className="h-[2px] bg-gray-600 mx-4 mb-6"></div>

      {/* Dropdown and Filter */}
      <div className="flex items-center justify-between mb-4 px-4">
        <div className="flex items-center gap-1 text-gray-700">
          <span className="font-medium">{currentPage}</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
        <svg
          className="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </div>

      {/* Email List */}
      <div className="flex flex-col gap-2">
      
        {emails.map((email) => (
          <div
            key={email.id}
            className="flex items-center gap-4 p-4 bg-white shadow-md rounded-lg hover:bg-gray-50"
            onClick={() => onSelectEmail(email.id)} 
          
          >
            {/* Sender Initial */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold ${email.bgColor}`}
            >
              {email.senderInitial}
            </div>

            <div className="flex flex-grow flex-col">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{email.sender}</span>
                <span className="text-sm text-gray-500">{email.time}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{email.title}</span>
              <span className="text-sm text-gray-500">{email.preview}</span>
            </div>

            <div
              className="cursor-pointer"
              onClick={() => {
                email.isStarred = !email.isStarred
              
              }}
            >
              {email.isStarred ? (
                <AiFillStar className="text-yellow-400" />
              ) : (
                <AiOutlineStar className="text-gray-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailList;









