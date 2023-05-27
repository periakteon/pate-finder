import { useEffect, useState } from "react";
import { atom, useAtom } from "jotai";
import Sidebar from "@/components/Sidebar/sidebar";
import {
  UserProfileResponseSchema,
  UserProfileSchema,
} from "@/utils/zodSchemas";
import { z } from "zod";
import MyProfileHeaderComponent from "@/components/Profile/MyProfileHeader";
import MyProfilePosts from "@/components/Profile/MyProfilePosts";

type UserProfileType = z.infer<typeof UserProfileSchema>;

export const myProfileAtom = atom<UserProfileType | null>(null);

const MyProfile = () => {
  const [myProfile, SetMyProfile] = useAtom(myProfileAtom);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/profile/myprofile");
        const parsed = await UserProfileResponseSchema.safeParseAsync(
          await res.json(),
        );

        if (!parsed.success) {
          console.log("Parsing Error");
        }

        if (parsed.success && parsed.data.success) {
          const { user } = parsed.data;
          SetMyProfile(user);
        }
      } catch (error) {
        console.log("Fetch error");
      }
    };
    fetchData();
  }, [SetMyProfile]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="flex flex-col items-center">
          <MyProfileHeaderComponent />
          <MyProfilePosts />
        </div>
      </div>
    </>
  );
};

export default MyProfile;
