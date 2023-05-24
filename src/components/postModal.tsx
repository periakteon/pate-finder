import React from "react";
import Modal from "react-modal";
import Dropzone from "./dropzone";
import { useAtom } from "jotai";
import { isModalOpenAtom } from "./sidebar";

Modal.setAppElement("#__next");

const PostModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useAtom(isModalOpenAtom);

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      shouldCloseOnOverlayClick={true}
      contentLabel="Post Modal"
      className="fixed inset-0 flex items-center justify-center overflow-auto z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-49"
    >
      <Dropzone />
    </Modal>
  );
};

export default PostModal;
