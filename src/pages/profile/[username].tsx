import { useEffect } from "react";
import { useRouter } from "next/router";
import { atom, useAtom } from "jotai";
import Sidebar from "@/components/sidebar";
import {
  UserProfileResponseSchema,
  UserProfileSchema,
} from "@/utils/zodSchemas";
import { z } from "zod";
import UsersProfileHeader from "@/components/UsersProfileHeader";
import UsersProfilePosts from "@/components/UsersProfilePosts";

type UserProfileType = z.infer<typeof UserProfileSchema>;

export const profileAtom = atom<UserProfileType | null>(null);

const ProfilePage = () => {
  const router = useRouter();
  const { username } = router.query;
  const [, setProfile] = useAtom(profileAtom);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/profile/${username}`);
        const parsed = await UserProfileResponseSchema.safeParseAsync(
          await res.json(),
        );
        console.log("response:", res)
        console.log("parsed", parsed)
        if (!parsed.success) {
          console.log("Parsing Error");
        }

        if (parsed.success && parsed.data.success) {
          const { user } = parsed.data;
          setProfile(user);
        }
      } catch (error) {
        console.log("Fetch error");
      }
    };
    fetchData();
  }, [username, setProfile]);

  return (
    <>
      <div className="flex">
      <div className="w-2/3">
        <Sidebar />
      </div>
      <div className="flex flex-col items-center">
        <UsersProfileHeader />
        <UsersProfilePosts />
      </div>
    </div>
    </>
  );
};

export default ProfilePage;
