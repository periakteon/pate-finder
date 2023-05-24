import Sidebar from "@/components/sidebar";
import ProfileHeader from "@/components/profileHeader";
import ProfilePosts from "@/components/profilePosts";
import { useState, useEffect } from "react";
import { atom, useAtom } from "jotai";

type Post = {
  id: number;
  caption: string;
  postImage: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
};
export const petNameAtom = atom<string>("");
export const petImageAtom = atom<string>("");
export const petBioAtom = atom<string>("");
export const postNumberAtom = atom<number>(0);
export const followersNumberAtom = atom<number>(0);
export const followingNumberAtom = atom<number>(0);
export const isLoadingAtom = atom<boolean>(true);
export const postsAtom = atom<Post[]>([]);
export const postLikeNumberAtom = atom<number>(0);

const Profile = () => {
  // const [posts, setPosts] = useState<Post[]>([]);
  const [, setPetName] = useAtom(petNameAtom);
  const [, setPetImage] = useAtom(petImageAtom);
  const [, setPetBio] = useAtom(petBioAtom);
  const [, setPostNumber] = useAtom(postNumberAtom);
  const [, setFollowersNumber] = useAtom(followersNumberAtom);
  const [, setFollowingNumber] = useAtom(followingNumberAtom);
  const [, setIsLoading] = useAtom(isLoadingAtom);
  const [, setPosts] = useAtom(postsAtom);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/myProfile");
      const data = await response.json();
      console.log(data)
      setPosts(data.user.posts);
      setPetName(data.user.pet.name);
      setPetImage(data.user.pet.pet_photo);
      setPetBio(data.user.pet.bio);
      setPostNumber(data.user.posts.length);
      setFollowersNumber(data.user.followedBy.length);
      setFollowingNumber(data.user.following.length);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col items-center">
        <ProfileHeader />
        <ProfilePosts />
      </div>
    </div>
  );
};

export default Profile;
