import React, { ReactNode } from 'react';


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed mt-30 inset-30 z-99 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 mt-10 rounded-md shadow-lg max-w-4xl w-full">
        <button onClick={onClose} className="bg-red rounded-xl px-4 py-2 mt-24 ml-30">Close</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
