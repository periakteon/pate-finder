import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faComment } from "@fortawesome/free-solid-svg-icons";
import { myProfileAtom } from "@/pages/myprofile";
import { atom, useAtom } from "jotai";
import { useState, useEffect } from "react";
import MyProfilePostModal from "./MyProfilePostModal";

export const selectedProfilePostIdAtom = atom<number | null>(null);
export const selectedProfilePostAtom = atom<any | null>(null);
export const isProfilePostModalOpenAtom = atom<boolean>(false);

const MyProfilePosts: React.FC = () => {
  const [myProfile] = useAtom(myProfileAtom);
  const [mounted, setMounted] = useState(false);
  const [selectedProfilePostId, setSelectedProfilePostId] = useAtom(
    selectedProfilePostIdAtom,
  );
  const [, setSelectedProfilePost] = useAtom(selectedProfilePostAtom);
  const [isProfilePostModalOpen, setIsProfilePostModalOpen] = useAtom(
    isProfilePostModalOpenAtom,
  );

  useEffect(() => {
    if (selectedProfilePostId !== null) {
      const post =
        myProfile &&
        myProfile.posts.find((p) => p.id === selectedProfilePostId);
      setSelectedProfilePost(post);
      setIsProfilePostModalOpen(true);
    } else {
      setIsProfilePostModalOpen(false);
      setSelectedProfilePost(null);
    }
  }, [
    selectedProfilePostId,
    myProfile,
    setIsProfilePostModalOpen,
    setSelectedProfilePost,
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!myProfile) {
    return null;
  }

  if (!mounted) {
    return null;
  }

  const handleComment = (postId: number) => {
    setSelectedProfilePostId(postId);
  };

  return (
    <div className="justify-center items-center">
      <div className="flex flex-wrap justify-center p-2">
        {myProfile.posts.map((post, id) => (
          <div key={id} className="basis-1/2 p-2 max-w-sm justify-center flex">
            <button
              className="relative w-80"
              onClick={() => handleComment(post.id)}
            >
              <div className="w-80 h-80">
                <Image
                  src={post.postImage}
                  alt="post image"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
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
      {isProfilePostModalOpen && <MyProfilePostModal />}
    </div>
  );
};

export default MyProfilePosts;
