import { useEffect, useState, CSSProperties } from "react";
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
import { BeatLoader } from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "black",
};

type UserProfileType = z.infer<typeof UserProfileSchema>;

export const myProfileAtom = atom<UserProfileType | null>(null);

const MyProfile: React.FC = () => {
  const [myProfile, SetMyProfile] = useAtom(myProfileAtom);
  const [mounted, setMounted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

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
      } finally {
        setLoading(false);
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
          <MyProfileHeaderComponent />
          <MyProfilePosts />
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
