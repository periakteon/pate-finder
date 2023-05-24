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
