import { useState, useEffect } from "react";
import Image from "next/image";
import { isFollowingAtom, profileAtom } from "@/pages/profile/[username]";
import { atom, useAtom } from "jotai";
import UsersProfileHeaderDetailsModal from "./UsersProfileHeaderDetailsModal";
import { toast } from "react-toastify";

export const isUserHeaderDetailsModalOpenAtom = atom<boolean>(false);

const UsersProfileHeaderComponent: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [profile] = useAtom(profileAtom);
  const [isFollowing, setIsFollowing] = useAtom(isFollowingAtom);
  const [isUserHeaderDetailsModalOpen, setIsUserHeaderDetailsModalOpen] =
    useAtom(isUserHeaderDetailsModalOpenAtom);

  const handleScroll = () => {
    if (window.pageYOffset > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!profile) {
    return null;
  }

  const handleFollow = async () => {
    try {
      const response = await fetch("/api/follow/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: profile.email,
        }),
      });

      if (response.ok) {
        toast.success("Başarıyla takip edildi!", {
          draggable: false,
          autoClose: 1800,
        });
        setIsFollowing(true);
      } else {
        console.error("Follow request failed");
      }
    } catch (error) {
      console.error("Follow request failed:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await fetch("/api/follow/unfollow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: profile.email,
        }),
      });

      const data = await response.json();
      console.log("data:", data);

      if (response.ok) {
        toast.success("Başarıyla takipten çıkıldı!", {
          draggable: false,
          autoClose: 1800,
        });
        setIsFollowing(false);
      } else {
        console.error("Unfollow request failed");
      }
    } catch (error) {
      console.error("Unfollow request failed:", error);
    }
  };

  return (
    <div
      className={`${
        isScrolled
          ? "h-30 border-b-2 border-b-light-border dark:border-b-dark-border"
          : ""
      } border-b-2 border-b-light-border dark:border-b-dark-border flex flex-col items-center w-full sticky top-0 bg-light-primary dark:bg-dark-background backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 z-[50] mt-5`}
    >
      {!isScrolled && (
        <div
          className={`relative rounded-full overflow-hidden transition-transform duration-300`}
        >
          <Image
            src={profile.profile_picture || "/images/default.jpeg"}
            width={175}
            height={175}
            alt="profile picture"
            className="rounded-full border-4 border-pink-500 dark:border-dark-border aspect-square object-cover "
          />
        </div>
      )}
      <div className="flex">
        <h1 className="text-2xl font-bold mt-4 transition-transform duration-300">
          {profile.username}
        </h1>
      </div>
      <div className="flex flex-col">
        <p className="text-gray-500 transition-transform duration-300">
          {profile.bio}
        </p>
        {isFollowing ? (
          <button
            className={
              "bg-light-dropzone hover:bg-pink-300 dark:bg-dark-border dark:text-slate-300 dark:hover:bg-dark-hover px-4 py-2 rounded-md mt-2"
            }
            onClick={handleUnfollow}
          >
            Takibi Bırak
          </button>
        ) : (
          <button
            className={
              "bg-light-dropzone hover:bg-pink-300 dark:bg-dark-border dark:text-slate-300 dark:hover:bg-dark-hover px-4 py-2 rounded-md mt-2"
            }
            onClick={handleFollow}
          >
            Takip Et
          </button>
        )}
      </div>
      <div className="flex my-4">
        <div
          className="flex text-center hover:cursor-pointer transition-transform duration-300 px-3"
          onClick={() => setIsUserHeaderDetailsModalOpen(true)}
        >
          <div className="mr-4">
            <h2 className="text-lg font-bold transition-transform duration-300">
              Gönderiler
            </h2>
            <p className="text-gray-500 transition-transform duration-300">
              {profile.posts.length}
            </p>
          </div>
          <div className="mr-4">
            <h2 className="text-lg font-bold transition-transform duration-300">
              Takipçiler
            </h2>
            <p className="text-gray-500 transition-transform duration-300">
              {profile.followedBy.length}
            </p>
          </div>
          <div className="mr-4">
            <h2 className="text-lg font-bold transition-transform duration-300">
              Takip Edilenler
            </h2>
            <p className="text-gray-500 transition-transform duration-300">
              {profile.following.length}
            </p>
          </div>
          <div className="mr-4">
            <h2 className="text-lg font-bold transition-transform duration-300">
              Pet
            </h2>
            <p className="text-gray-500 transition-transform duration-300">
              {profile.pet && profile.pet.pet_photo ? (
                <Image
                  src={profile.pet.pet_photo}
                  className="rounded-full"
                  width={64}
                  height={64}
                  alt="Pet Photo"
                />
              ) : (
                "0"
              )}
            </p>
          </div>
        </div>
      </div>
      {isUserHeaderDetailsModalOpen && <UsersProfileHeaderDetailsModal />}
    </div>
  );
};

export default UsersProfileHeaderComponent;
