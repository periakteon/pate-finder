import { useEffect } from "react";
import { useRouter } from "next/router";
import { atom, useAtom } from "jotai";
import Sidebar from "@/components/Sidebar/sidebar";
import {
  UserProfileResponseSchema,
  UserProfileSchema,
} from "@/utils/zodSchemas";
import { z } from "zod";
import UsersProfileHeaderComponent from "@/components/Profile/UsersProfileHeader";
import UsersProfilePostsComponent from "@/components/Profile/UsersProfilePosts";

type UserProfileType = z.infer<typeof UserProfileSchema>;

export const profileAtom = atom<UserProfileType | null>(null);

const ProfilePage: React.FC = () => {
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
    <div className={` w-full h-full`}>
      <div className="flex">
        <div className="fixed flex z-[120]">
          <Sidebar />
        </div>
        <div className="md:w-full md:min-h-screen md:p-8 lg:ms-14 xl:ms-16 2xl:ms-40">
          <UsersProfileHeaderComponent />
          <UsersProfilePostsComponent />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
