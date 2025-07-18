import React from "react";
import { AiOutlineClose } from "react-icons/ai";

interface Props {
  title: string;
  onClick?: () => void;
}

const RedButton: React.FC<Props> = ({ title, onClick }) => {
  return (
    <button
      className="flex items-center text-nowrap rounded-md border bg-rose-500 p-2 hover:bg-rose-600"
      onClick={onClick}
    >
      <AiOutlineClose className="mr-1" />
      {title}
    </button>
  );
};

export default RedButton;
