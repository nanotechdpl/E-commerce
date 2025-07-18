import React, { ReactNode } from "react";
interface ModalProps {
  isVisible: boolean;
  onClose: (value: boolean) => void;
  children: ReactNode;
  hideCloseIcon?: boolean;
}
const Modal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  children,
  // hideCloseIcon = true,
}) => {
  if (!isVisible) return null;
  // console.log(isVisible);
  return (
    <div className="absolute inset-0  top-0 z-10 mt-3 flex items-center justify-center p-12">
      <div className=" flex flex-col   ">
        {/* {
          hideCloseIcon && (
            <button
              className="relative text-sm text-white place-self-end -top-2 right-4  bg-slate-700 hover:bg-slate-900 h-10 w-10 rounded-full p-2"
              onClick={isVisible}
            >
              <span className="text-lg text-center ">X</span>
            </button>
          )
        } */}

        <button
          className="relative -right-4 -top-2 h-10 w-10 place-self-end  rounded-full bg-rose-700 p-2 text-sm text-white hover:bg-rose-900"
          onClick={() => onClose(false)}
        >
          <span className="text-center text-lg">X</span>
          <div className="absolute top-96  z-50 rotate-45  ">
            <div className="-ml-4 h-14 w-14 rotate-90  rounded-br-[300px]   bg-slate-500"></div>
          </div>
        </button>
        <div className=" relative h-fit  w-fit  overflow-auto rounded bg-slate-500 p-5   pt-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
