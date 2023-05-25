import { useEffect } from "react";
import { useRouter } from "next/router";
import { atom, useAtom } from "jotai";
import Sidebar from "@/components/sidebar";
import {
  UserProfileResponseSchema,
  UserProfileSchema,
} from "@/utils/zodSchemas";
import { z } from "zod";
import UsersProfile from "@/components/UsersProfile";

type UserProfileType = z.infer<typeof UserProfileSchema>;

export const profileAtom = atom<UserProfileType | null>(null);

const ProfilePage = () => {
  const router = useRouter();
  const { username } = router.query;
  const [profile, setProfile] = useAtom(profileAtom);

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
    <>
      <div className="flex flex-row">
        <Sidebar />
        <UsersProfile />
      </div>
    </>
  );
};

export default ProfilePage;
