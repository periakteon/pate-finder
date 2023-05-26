import { useEffect } from "react";
import { atom, useAtom } from "jotai";
import Sidebar from "@/components/sidebar";
import {
  UserProfileResponseSchema,
  UserProfileSchema,
} from "@/utils/zodSchemas";
import { z } from "zod";
import MyProfileHeaderComponent from "@/components/MyProfileHeader";
import MyProfilePosts from "@/components/MyProfilePosts";



type UserProfileType = z.infer<typeof UserProfileSchema>;

export const myProfileAtom = atom<UserProfileType | null>(null);

const MyProfile = () => {
  const [myProfile, SetMyProfile] = useAtom(myProfileAtom);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/profile/myprofile");
        const parsed = await UserProfileResponseSchema.safeParseAsync(
          await res.json(),
        );
        console.log(parsed)

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

  return (
    <>
      <div className="flex">
      <div className="w-2/3">
        <Sidebar />
      </div>
      <div className="flex flex-col items-center">
        <MyProfileHeaderComponent />
        <MyProfilePosts />
      </div>
    </div>
    </>
  );
};

export default MyProfile;
