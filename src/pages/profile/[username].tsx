import { useEffect, useState, CSSProperties } from "react";
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
import { BeatLoader } from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "black",
};

type UserProfileType = z.infer<typeof UserProfileSchema>;

export const profileAtom = atom<UserProfileType | null>(null);
export const isFollowingAtom = atom<boolean>(false);

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { username } = router.query;
  const [profile, setProfile] = useAtom(profileAtom);
  const [, setIsFollowing] = useAtom(isFollowingAtom);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (profile) {
        try {
          const response = await fetch("/api/follow/check", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: profile.email }),
          });
          const data = await response.json();
          if (data.success === true) {
            setIsFollowing(true);
          } else {
            setIsFollowing(false);
          }
        } catch (error) {
          console.error("API error:", error);
        }
      }
    };

    fetchData();
  }, [profile, setIsFollowing]);

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
      } finally {
        setLoading(false);
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
          {loading && (
            <div className="flex justify-center items-center w-full h-full">
              <div>
                <BeatLoader
                  cssOverride={override}
                  size={15}
                  color={"pink"}
                  loading={loading}
                />
              </div>
            </div>
          )}
          <UsersProfileHeaderComponent />
          <UsersProfilePostsComponent />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
