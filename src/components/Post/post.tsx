import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaw,
  faComment,
  faShare,
  faHeartCrack,
} from "@fortawesome/free-solid-svg-icons";
import { formatCreatedAt, formatFullDate } from "@/utils/dateHelper";
import CommentsModal from "./CommentsModal";
import { z } from "zod";
import { atom, useAtom } from "jotai";
import { infinitePostType } from "@/utils/zodSchemas";
import Link from "next/link";

type PostProps = {
  post: PostType;
};

type PostType = z.infer<typeof infinitePostType>;

export const selectedPostIdAtom = atom<number | null>(null);
export const isCommentsModalOpen = atom<boolean>(false);

const PostComponent: React.FC<PostProps> = ({ post }) => {
  const [fullDate, setFullDate] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [, setSelectedPostId] = useAtom(selectedPostIdAtom);
  const [commentsModalOpen, setCommentsModalOpen] =
    useAtom(isCommentsModalOpen);

  const handleComment = () => {
    if (post) {
      setSelectedPostId(post.id);
      setCommentsModalOpen(true);
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch("/api/post/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: post.id }),
      });

      const data = await response.json();

      if (data.success) {
        setLiked(true);
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
        body: JSON.stringify({ postId: post.id }),
      });

      const data = await response.json();

      if (data.success) {
        setLiked(false);
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await fetch(`/api/post/check-like?postId=${post.id}`);
        const data = await response.json();
        setLiked(data.liked);
      } catch (error) {
        console.error("Bir hata oluştu:", error);
      }
    };

    checkLikeStatus();
  }, [post.id]);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-2 md:p-6 my-8 border border-gray-200 max-w-[600px] dark:bg-dark-secondary dark:border-gray-500">
        <div className="flex items-center mb-4">
          <Link href={`/profile/${post.author.username}`}>
            <div className="w-12 h-12 mr-4">
              {post.author.profile_picture === null ? (
                <Image
                  priority
                  className="rounded-full border border-gray-300"
                  src="/images/default.jpeg"
                  alt="image"
                  width={48}
                  height={48}
                />
              ) : (
                <Image
                  priority
                  className="rounded-full border border-gray-300"
                  src={post.author.profile_picture}
                  alt="image"
                  width={48}
                  height={48}
                />
              )}
            </div>
          </Link>
          <Link href={`/profile/${post.author.username}`}>
            <div className="font-semibold text-xl text-gray-500 hover:text-gray-400 dark:hover:text-gray-400 dark:text-gray-300 ">
              {post.author.username}
            </div>
          </Link>
          <div
            className="text-gray-400 text-sm ml-auto"
            onMouseEnter={() => setFullDate(true)}
            onMouseLeave={() => setFullDate(false)}
          >
            {fullDate
              ? formatFullDate(post.createdAt)
              : formatCreatedAt(post.createdAt, () => setFullDate(true))}
          </div>
        </div>
        <h2 className="text-lg mb-2 whitespace-normal text-justify text-gray-500 dark:text-gray-300 ">
          {post.caption}
        </h2>
        <div
          onClick={handleComment}
          className="cursor-pointer relative flex justify-center aspect-w-1 aspect-h-1 mb-4"
        >
          <Image
            priority
            className="flex object-cover rounded-lg hover:opacity-90 transition duration-300 ease-in-out hover:scale-95"
            src={post.postImage}
            alt="image"
            width={600}
            height={600}
          />
        </div>
        <div className="flex justify-evenly">
          <button
            className="flex items-center text-green-500 hover:text-green-800"
            onClick={liked ? handleDislike : handleLike}
          >
            <FontAwesomeIcon
              icon={liked ? faHeartCrack : faPaw}
              className="text-2xl mr-2"
            />
            {liked ? "Beğenmekten Vazgeç" : "Beğen"}
          </button>
          <button
            onClick={handleComment}
            className="flex items-center  text-blue-500 hover:text-blue-800 "
          >
            <FontAwesomeIcon icon={faComment} className="text-2xl mr-2" />
            Yorum
          </button>
        </div>
      </div>
      <hr className="divide-x my-4 dark:border-dark-border" />
      {commentsModalOpen && <CommentsModal post={post} />}
    </>
  );
};

export default PostComponent;
