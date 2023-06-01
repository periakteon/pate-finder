import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faComment } from "@fortawesome/free-solid-svg-icons";
import { profileAtom } from "@/pages/profile/[username]";
import { atom, useAtom } from "jotai";
import { useState, useEffect } from "react";
import UsersProfilePostModal from "./UsersProfilePostModal";

type Comment = {
  id: number;
  text: string;
  createdAt?: string;
  updatedAt?: string;
  user: {
    username: string;
    profile_picture: string | null;
  };
};

export const selectedUserProfilePostIdAtom = atom<number | null>(null);
export const selectedUserProfilePostAtom = atom<any | null>(null);
export const isUserProfilePostModalOpenAtom = atom<boolean>(false);
export const commentListAtom = atom<Comment[]>([]);

const UsersProfilePostsComponent: React.FC = () => {
  const [profile] = useAtom(profileAtom);
  const [mounted, setMounted] = useState(false);
  const [selectedUserProfilePostId, setSelectedUserProfilePostId] = useAtom(
    selectedUserProfilePostIdAtom,
  );
  const [selectedUserProfilePost, setSelectedUserProfilePost] = useAtom(
    selectedUserProfilePostAtom,
  );
  const [isUserProfilePostModalOpen, setIsUserProfilePostModalOpen] = useAtom(
    isUserProfilePostModalOpenAtom,
  );
  const [commentList, setCommmentList] = useAtom(commentListAtom);

  useEffect(() => {
    if (selectedUserProfilePostId !== null) {
      const post =
        profile &&
        profile.posts.find((p) => p.id === selectedUserProfilePostId);

      if (post) {
        const comments = post.comments;
        setCommmentList(comments);
      }

      setSelectedUserProfilePost(post);
      setIsUserProfilePostModalOpen(true);
    } else {
      setIsUserProfilePostModalOpen(false);
      setSelectedUserProfilePost(null);
    }
  }, [
    selectedUserProfilePostId,
    profile,
    setIsUserProfilePostModalOpen,
    setSelectedUserProfilePost,
    setCommmentList,
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!profile) {
    return null;
  }

  if (!mounted) {
    return null;
  }

  const handleComment = (postId: number) => {
    setSelectedUserProfilePostId(postId);
  };

  return (
    <div className="justify-center items-center">
      <div className="flex flex-wrap justify-center p-2">
        {profile.posts.map((post, id) => (
          <div key={id} className="p-2">
            <button
              className="relative w-80"
              onClick={() => handleComment(post.id)}
            >
              <div className="w-80 h-80">
                <Image
                  src={post.postImage}
                  alt="post image"
                  width={320}
                  height={320}
                  className="flex object-cover rounded-lg hover:opacity-90 transition duration-300 ease-in-out hover:scale-95"
                />
              </div>
              <div className="absolute bottom-0 rounded-t-lg left-0 p-2 bg-black bg-opacity-50 w-18 justify-start">
                <div className="flex flex-row text-green-600 hover:text-green-800">
                  <FontAwesomeIcon icon={faPaw} className="text-l mr-2 " />
                  <div>{post.likes.length || 0}</div>
                </div>

                <div className="flex flex-row text-blue-600 hover:text-blue-800">
                  <FontAwesomeIcon icon={faComment} className="text-l mr-2" />
                  <div>{post.comments.length || 0}</div>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
      {isUserProfilePostModalOpen && <UsersProfilePostModal />}
    </div>
  );
};

export default UsersProfilePostsComponent;
