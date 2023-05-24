import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useAtom } from "jotai";
import { isCommentsModalOpen, selectedPostIdAtom } from "./post";
import Image from "next/image";
import { formatCreatedAt, formatFullDate } from "@/utils/dateHelper";
import Link from "next/link";
import { toast } from "react-toastify";

Modal.setAppElement("#__next");

type Comment = {
  id: number;
  text: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user: {
    username: string;
    profile_picture: string | null;
  };
};

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
  comments: Comment[];
};

const CommentsModal: React.FC<{ post: Post }> = ({ post }) => {
  const { id, caption, postImage, createdAt, author, comments } = post;
  const [commentsModalOpen, setCommentsModalOpen] =
    useAtom(isCommentsModalOpen);
  const [selectedPostId, setSelectedPostId] = useAtom(selectedPostIdAtom);
  const [commentList, setCommentList] = useState<Comment[]>(comments);
  const [newComment, setNewComment] = useState("");

  const closeModal = () => {
    setCommentsModalOpen(false);
    setSelectedPostId(null);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/post/comment/addComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newComment,
        postId: id,
      }),
    });

    if (response.ok) {
      const responseData = await response.json();
      const newCommentData = responseData.comment;
      setCommentList((prevCommentList) => [...prevCommentList, newCommentData]);
      toast.success("Yorum başarıyla eklendi!", {
        draggable: false,
        autoClose: 1800,
      });
    } else {
      toast.error("Yorum eklenirken bir hata oluştu!", {
        draggable: false,
        autoClose: 1800,
      });
    }

    setNewComment(""); // Clear the comment input field after submission
  };

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

          {commentList.length > 0 ? (
            commentList.map((comment, id) => (
              <>
                <div key={id} className="mb-2 flex items-center">
                  <div className="rounded-full">
                    <Image
                      src={
                        comment.user.profile_picture !== null
                          ? comment.user.profile_picture
                          : "/images/default.jpeg"
                      }
                      alt="Profile Picture"
                      className="rounded-full"
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className="flex flex-col ml-4">
                    <div className="font-bold">
                      <Link href={`/profile/${comment.user.username}`}>
                        {comment.user.username}
                      </Link>
                    </div>
                    <div>{comment?.text}</div>
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
          <form onSubmit={handleCommentSubmit}>
            <div className="flex flex-col items-center justify-center mt-3">
              <textarea
                name="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Yorumunuzu buraya girin"
                className="w-full h-20 px-4 py-2 mb-4 border border-gray-300 rounded"
              ></textarea>
              <button
                type="submit"
                className="w-full px-4 py-2  items-center justify-center text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Yorumu Gönder
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default CommentsModal;
