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
import { toast } from "react-toastify";

type UserProfileType = z.infer<typeof UserProfileSchema>;

export const myProfileAtom = atom<UserProfileType | null>(null);

const MyProfile: React.FC = () => {
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
          throw new Error(parsed.error.toString());
        }

        if (parsed.success && parsed.data.success) {
          const { user } = parsed.data;
          SetMyProfile(user);
        }
      } catch (error) {
        toast.error(`Hata: ${error}`, {
          draggable: false,
          autoClose: 2000,
        });
      }
    };

    fetchData();
  }, [SetMyProfile]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`${mounted ? "block" : "hidden"} w-full h-full`}>
      <div className="flex">
        <div className="fixed flex z-[120]">
          <Sidebar />
        </div>
        <div className="w-full min-h-screen p-8">
          <MyProfileHeaderComponent />
          <MyProfilePosts />
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
