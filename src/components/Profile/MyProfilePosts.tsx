import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faComment } from "@fortawesome/free-solid-svg-icons";
import { myProfileAtom } from "@/pages/myprofile";
import { atom, useAtom } from "jotai";
import { useState, useEffect } from "react";
import MyProfilePostModal from "./MyProfilePostModal";
import { infinitePostType } from "@/utils/zodSchemas";
import { z } from "zod";

type MyProfilePostType = z.infer<typeof infinitePostType>;

export const selectedProfilePostIdAtom = atom<number | null>(null);
export const selectedProfilePostAtom = atom<any | null>(null);
export const isProfilePostModalOpenAtom = atom<boolean>(false);

const MyProfilePosts = () => {
  const [myProfile] = useAtom(myProfileAtom);
  const [mounted, setMounted] = useState(false);
  const [selectedProfilePostId, setSelectedProfilePostId] = useAtom(
    selectedProfilePostIdAtom,
  );
  const [selectedProfilePost, setSelectedProfilePost] = useAtom(
    selectedProfilePostAtom,
  );
  const [isProfilePostModalOpen, setIsProfilePostModalOpen] = useAtom(
    isProfilePostModalOpenAtom,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleComment = (postId: number) => {
    setSelectedProfilePostId(postId);
  };

  if (!mounted) {
    return null;
  }

  if (!myProfile) {
    return null;
  }

  return (
    <div className="p-5 justify-center items-center">
      <div className="flex flex-wrap justify-center p-2">
        {myProfile.posts.map((post, id) => (
          <div key={id} className="basis-1/3 p-2 justify-center flex">
            <button
              className="relative w-80"
              onClick={() => handleComment(post.id)}
            >
              <Image
                src={post.postImage}
                alt="post image"
                width={320}
                height={320}
                className="rounded-lg"
              />
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
