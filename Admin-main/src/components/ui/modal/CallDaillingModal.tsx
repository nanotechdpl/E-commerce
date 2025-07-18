import React,{ReactNode} from "react";
interface ModalProps{
    isVisible: boolean;
    onClose:(value:boolean)=>void;
    children:ReactNode;
    hideCloseIcon?: boolean;
    className?: string;
    }
const CallDaillingModal:React.FC<ModalProps> = ({ isVisible, onClose, children, hideCloseIcon = true }) => {
  if (!isVisible) return null;
  return (
    <div className="absolute flex justify-center items-center inset-0 z-10 top-0 mt-3">
      <div className=" flex flex-col">
        <div className=" relative bg-[#BDBEC1]  rounded-xl h-fit w-fit p-5 pt-6 overflow-auto">
          {children}
          
        </div>
      </div>
    </div>
  );
};

export default CallDaillingModal;
