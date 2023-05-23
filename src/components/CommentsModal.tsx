import React from "react";
import Modal from "react-modal";
import { useAtom } from "jotai";
import { isCommentsModalOpen, selectedPostIdAtom } from "./post";
import Image from "next/image";
import { formatFullDate } from "@/utils/dateHelper";

Modal.setAppElement("#__next");

type Post = {
  id: number;
  author: {
    username: string;
    profile_picture?: string | null;
  };
  authorId: number;
  caption: string;
  postImage: string;
  createdAt: string;
  updatedAt: string;
};

const CommentsModal: React.FC<{ post: Post }> = ({ post }) => {
  const [commentsModalOpen, setCommentsModalOpen] = useAtom(isCommentsModalOpen);
  const [selectedPostId, setSelectedPostId] = useAtom(selectedPostIdAtom);

  const closeModal = () => {
    setCommentsModalOpen(false);
    setSelectedPostId(null);
  };

  const { id, caption, postImage, createdAt, author } = post;

  return (
    <Modal
      isOpen={commentsModalOpen && selectedPostId === id}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={true}
      contentLabel="Comments Modal"
      className="fixed inset-0 flex items-center justify-center overflow-auto z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-49"
    >
      <div>
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">Comments {id}</div>
          <div>Başlık {caption}</div>
          <div>Resim <Image src={postImage} alt="Post Image" height={400} width={400} /></div>
          <div>Tarih: {formatFullDate(createdAt)}</div>
          <div>Yazar: {author.username}</div>
          {author.profile_picture && (
            <div>
              <Image className="rounded-full" src={author.profile_picture} alt="Avatar" width={64} height={64} />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CommentsModal;
