import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useAtom } from "jotai";
import Image from "next/image";
import { formatCreatedAt, formatFullDate } from "@/utils/dateHelper";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  selectedProfilePostIdAtom,
  isProfilePostModalOpenAtom,
  selectedProfilePostAtom,
} from "./MyProfilePosts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaw,
  faHeartCrack,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

Modal.setAppElement("#__next");

type Comment = {
  id: number;
  text: string;
  createdAt?: string;
  updatedAt?: string;
  userId: number;
  user: {
    username: string;
    profile_picture: string | null;
  };
};

const MyProfilePostModal: React.FC = () => {
  const [isProfilePostModalOpen, setIsProfilePostModalOpen] = useAtom(
    isProfilePostModalOpenAtom,
  );
  const [selectedProfilePostId, setSelectedProfilePostId] = useAtom(
    selectedProfilePostIdAtom,
  );
  const [selectedProfilePost] = useAtom(selectedProfilePostAtom);
  const { id, caption, postImage, createdAt, author, comments } =
    selectedProfilePost || {};
  const [commentList, setCommentList] = useState<Comment[]>(comments || []);
  const [newComment, setNewComment] = useState<any>("");
  const [liked, setLiked] = useState<boolean>(false);

  const closeModal = () => {
    setIsProfilePostModalOpen(false);
    setSelectedProfilePostId(null);
  };

  const handleLike = async () => {
    try {
      const response = await fetch("/api/post/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: id }),
      });

      const data = await response.json();

      if (data.success) {
        setLiked(true);
      } else {
        toast.error("Beğenirken bir hata oluştu!", {
          draggable: false,
          autoClose: 1800,
        });
        setLiked(false);
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await fetch("/api/post/dislike", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: id }),
      });

      const data = await response.json();

      if (data.success) {
        setLiked(false);
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
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
        setCommentList((prevCommentList) => [
          ...prevCommentList,
          newCommentData,
        ]);
        toast.success("Yorum başarıyla eklendi!", {
          draggable: false,
          autoClose: 1800,
        });
      } else {
        toast.success("Yorum eklenirken bir hata oluştu!", {
          draggable: false,
          autoClose: 1800,
        });
      }
    } catch (error: any) {
      toast.error(error.message, {
        draggable: false,
        autoClose: 1800,
      });
    }

    setNewComment("");
  };

  const handleLikeButtonClick = () => {
    if (liked) {
      handleDislike();
    } else {
      handleLike();
    }
  };

  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await fetch(`/api/post/check-like?postId=${id}`);
        const data = await response.json();
        setLiked(data.liked);
      } catch (error) {
        console.error("Bir hata oluştu:", error);
      }
    };

    checkLikeStatus();
  }, [id]);

  if (!selectedProfilePost) {
    return null;
  }

  return (
    <Modal
      isOpen={isProfilePostModalOpen && selectedProfilePostId === id}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={true}
      contentLabel="Comments Modal"
      className="fixed inset-0 flex items-center justify-center overflow-auto z-[150]"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[151]"
    >
      <div className=" bg-light-secondary dark:bg-dark-dropzone flex overflow-y-scroll">
      <div className="w-48 md:w-128 md:h-128 sticky top-0 bg-light-secondary dark:bg-dark-secondary border-r border-r-slate-400 dark:border-r-slate-600">
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
        <div className="w-3/5 flex flex-col justify-start p-4">
          <button
            className="absolute top-4 right-4 bg-transparent rounded-full p-2 hover:bg-gray-200 transition duration-300 focus:outline-none"
            onClick={closeModal}
          >
            <span className="h-6 w-6 text-2xl text-pink-600 hover:text-pink-700 dark:text-gray-300 hover:dark:text-gray-500">
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </button>
          <div className="flex items-center space-x-4">
            <Link
              onClick={() =>
                setTimeout(() => {
                  closeModal();
                }, 200)
              }
              href={`/profile/${author.username}`}
            >
              <div className="flex justify-start items-center space-x-2">
                {author.profile_picture && (
                  <Image
                    className="rounded-full border-2 border-pink-300 dark:border-slate-500 aspect-square object-cover "
                    src={
                      author.profile_picture === null
                        ? "/images/default.jpeg"
                        : author.profile_picture
                    }
                    alt="Avatar"
                    width={64}
                    height={64}
                  />
                )}
                <div className="font-bold text-xl text-pink-500 dark:text-gray-200">
                  {author.username}
                </div>{" "}
              </div>
            </Link>
          </div>
          <div className="text-xl text-justify my-4 text-slate-600 dark:text-gray-300">
            {caption}
          </div>
          <button
            className="flex items-center dark:text-slate-300 dark:hover:text-gray-400"
            onClick={handleLikeButtonClick}
          >
            <FontAwesomeIcon
              icon={liked ? faHeartCrack : faPaw}
              className="text-2xl mr-2 text-pink-600 dark:text-slate-400"
            />
            <span className="font-bold text-pink-600 dark:text-slate-400">
              {liked ? "Beğenmekten Vazgeç" : "Beğen"}
            </span>{" "}
          </button>
          <div className="text-gray-500 flex justify-start mt-2">
            {formatFullDate(createdAt)}
          </div>
          <hr className="my-4 border-slate-500 dark:border-dark-border" />

          {commentList.length > 0 && commentList ? (
            commentList.map((comment) => (
              <React.Fragment key={`comment-${comment.id}`}>
                <div className="mb-2 flex items-center">
                  <div className="rounded-full">
                    <Link
                      onClick={() =>
                        setTimeout(() => {
                          closeModal();
                        }, 200)
                      }
                      href={`/profile/${comment.user.username}`}
                    >
                      <Image
                        src={
                          comment.user.profile_picture !== null
                            ? comment.user.profile_picture
                            : "/images/default.jpeg"
                        }
                        alt="Profile Picture"
                        className="rounded-full aspect-square object-cover "
                        width={48}
                        height={48}
                      />
                    </Link>
                  </div>
                  <div className="flex flex-col ml-4">
                    <div className="font-bold">
                      <Link
                        onClick={() =>
                          setTimeout(() => {
                            closeModal();
                          }, 200)
                        }
                        href={`/profile/${comment.user.username}`}
                      >
                        <span className="text-pink-600 dark:text-white">
                          {comment.user.username}
                        </span>
                      </Link>
                    </div>
                    <div className="text-black dark:text-gray-300">
                      {comment.text}
                    </div>
                    <div className="mt-auto text-sm text-gray-500">
                      {formatCreatedAt(comment.createdAt)}
                    </div>
                  </div>
                </div>
                <hr
                  className="my-4 border-slate-500 dark:border-dark-border"
                  key={`hr-${comment.id}`}
                />
              </React.Fragment>
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    handleCommentSubmit(e);
                  }
                }}
                placeholder="Yorumunuzu buraya giriniz."
                className="w-full h-20 px-4 py-2 mb-4 border border-gray-300 rounded bg-white dark:bg-slate-800"
              ></textarea>
              <button
                type="submit"
                className="w-full px-4 py-2 mb-6 items-center justify-center bg-pink-400 hover:bg-pink-300 dark:bg-slate-800 dark:hover:bg-slate-500 text-white hover:text-white font-bold rounded-lg"
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

export default MyProfilePostModal;
