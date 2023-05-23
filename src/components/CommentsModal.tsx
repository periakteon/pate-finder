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
      <div className="w-2/3 h-full bg-dark-dropzone flex">
        <div className="w-2/3 bg-dark-secondary border-r-2 border-r-slate-700 relative">
          <div className="aspect-w-2 aspect-h-3">
            <Image
              priority
              src={postImage}
              alt="Post Image"
              layout="fill"
              objectFit="contain"
              objectPosition="center"
            />
          </div>
        </div>
        <div className="w-2/5 flex flex-col justify-start p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {author.profile_picture && (
                <Image className="rounded-full" src={author.profile_picture} alt="Avatar" width={64} height={64} />
              )}
              <div>{author.username}</div>
            </div>
            <div className="text-gray-500">{formatFullDate(createdAt)}</div>
          </div>
          <div className="text-lg font-bold my-4">{caption}</div>
          <hr className="my-4 dark:border-dark-border" />
          {/* Yorumlar buraya eklenebilir */}
          YORUMLAR
        </div>
      </div>
    </Modal>
  );
};

export default CommentsModal;
