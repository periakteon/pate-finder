import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faComment, faShare } from "@fortawesome/free-solid-svg-icons";

type PostProps = {
  post: Post;
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
};

const PostComponent: React.FC<PostProps> = ({ post }) => {
  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200 max-w-[600px]">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 mr-4">
            {post.author.profile_picture === null ? (
              <Image
                className="rounded-full border border-gray-300"
                src="https://img.freepik.com/free-icon/user_318-804790.jpg"
                alt="image"
                width={48}
                height={48}
              />
            ) : (
              <Image
                className="rounded-full border border-gray-300"
                src={post.author.profile_picture}
                alt="image"
                width={48}
                height={48}
              />
            )}
          </div>
          <div className="font-semibold text-md">{post.author.username}</div>
        </div>
        <h2 className="text-lg font-semibold mb-2 whitespace-normal text-justify">
          {post.caption}
        </h2>
        <div className="relative flex justify-center aspect-w-1 aspect-h-1 mb-4">
          <Image
            className="flex  object-cover rounded-lg"
            src={post.postImage}
            alt="image"
            width={600}
            height={600}
          />
        </div>
        <div className="flex justify-evenly">
          <button className="flex items-center  text-green-500 hover:text-green-800">
            <FontAwesomeIcon icon={faPaw} className="text-2xl mr-2" />
            Beğen
          </button>
          <button className="flex items-center  text-blue-500 hover:text-blue-800 ">
            <FontAwesomeIcon icon={faComment} className="text-2xl mr-2" />
            Yorum
          </button>
          <button className="flex items-center text-purple-500 hover:text-purple-800 ">
            <FontAwesomeIcon icon={faShare} className="text-2xl mr-2" />
            Paylaş
          </button>
        </div>
      </div>
      <hr className="divide-x my-4" />
    </>
  );
};

export default PostComponent;
