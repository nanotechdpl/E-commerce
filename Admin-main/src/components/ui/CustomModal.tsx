import { Modal } from "antd";
import { ReactElement, ReactNode } from "react";

interface IModal {
  isOpen: boolean;
  closeModal: () => void;
  title: string | ReactNode;
  children: ReactElement;
  handleOk?: () => void;
  showCancelButton?: boolean;
  showOkButton?: boolean;
  width?: number;
}

const CustomModal = ({
  isOpen,
  closeModal,
  title,
  children,
  handleOk,
  showCancelButton = true,
  showOkButton = true,
  width,
}: IModal) => {
  return (
    <Modal
      title={title}
      open={isOpen}
      onOk={handleOk}
      onCancel={closeModal}
      width={width ? width : "350px"}
      cancelButtonProps={{
        style: { display: showCancelButton ? "inline" : "none" },
      }}
      okButtonProps={{ style: { display: showOkButton ? "inline" : "none" } }}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
