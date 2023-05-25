import Sidebar from "@/components/sidebar";
import ProfileHeader from "@/components/profileHeader";
import ProfilePosts from "@/components/profilePosts";
import { useState, useEffect } from "react";
import { atom, useAtom } from "jotai";
import { myProfileResponseSchema } from "@/utils/zodSchemas";
import { z } from "zod";

type User = z.infer<typeof myProfileResponseSchema>;

export const isLoadingAtom = atom<boolean>(true);
export const userAtom = atom<User | null>(null);

const Profile = () => {
  const [, setIsLoading] = useAtom(isLoadingAtom);
  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await fetch("/api/myProfile");
        const data = await response.json();
        setIsLoading(false);
        console.log(data);
        if (!data.success) {
          console.error(data.errors);
          return;
        }
        setUser(data.user);
      };

      fetchData();
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  }, [setUser, setIsLoading]);
  // console.log("user:", user)

  return (
    <div className="flex">
      <div className="w-2/3">
        <Sidebar />
      </div>
      <div className="flex flex-col items-center">
        <ProfileHeader />
        {/* <ProfilePosts /> */}
      </div>
    </div>
  );
};

export default Profile;
/**
 * TODO:
 * 1. Fetch data from /api/myProfile
 * 2. Create a type for the data received
 * 3. Set data to AN / ONE atom (using type)
 * 4. Use the atom to display the data where it is needed
 * 5. No need to create a new atom for each data
 */
