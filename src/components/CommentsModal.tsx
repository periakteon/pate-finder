import React from "react";
import Modal from "react-modal";
import { useAtom } from "jotai";
import { isCommentsModalOpen, selectedPostIdAtom } from "./post";
import Image from "next/image";
import { formatCreatedAt, formatFullDate } from "@/utils/dateHelper";
import Link from "next/link";

Modal.setAppElement("#__next");

type Post = {
  id: number;
  author: {
    username: string;
    profile_picture: string | null;
  };
  authorId: number;
  caption: string;
  postImage: string;
  createdAt: string;
  updatedAt: string;
  comments: {
    id: number;
    text: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
    user: {
      username: string;
      profile_picture: string | null;
    };
  }[];
};

const CommentsModal: React.FC<{ post: Post }> = ({ post }) => {
  const [commentsModalOpen, setCommentsModalOpen] =
    useAtom(isCommentsModalOpen);
  const [selectedPostId, setSelectedPostId] = useAtom(selectedPostIdAtom);

  const closeModal = () => {
    setCommentsModalOpen(false);
    setSelectedPostId(null);
  };

  const { id, caption, postImage, createdAt, author, comments } = post;

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
                <Image
                  className="rounded-full"
                  src={author.profile_picture}
                  alt="Avatar"
                  width={64}
                  height={64}
                />
              )}
              <div>{author.username}</div>
            </div>
            <div className="text-gray-500">{formatFullDate(createdAt)}</div>
          </div>
          <div className="text-xl font-bold my-4">{caption}</div>
          <hr className="my-4 dark:border-dark-border" />
          {/* Yorumlar buraya eklenebilir */}
          {comments.length > 0 ? (
            comments.map((comment) => (
              <>
                <div key={comment.id} className="mb-2 flex items-center">
                  <div className="rounded-full">
                    <Image
                      src={
                        comment.user.profile_picture !== null
                          ? comment.user.profile_picture
                          : "/images/default.jpeg"
                      }
                      alt="Profile Picture"
                      className="rounded-full"
                      width={64}
                      height={64}
                    />
                  </div>
                  <div className="flex flex-col ml-2">
                    <div className="font-bold">
                      <Link href={`/profile/${comment.user.username}`}>
                        {comment.user.username}
                      </Link>
                    </div>

                    <div>{comment.text}</div>
                    <div className="mt-auto text-sm text-gray-500">
                      {formatCreatedAt(comment.createdAt)}
                    </div>
                  </div>
                </div>
                <hr className="my-4 dark:border-dark-border" />
              </>
            ))
          ) : (
            <div className="text-center text-slate-500">Yorum bulunamadı.</div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CommentsModal;
