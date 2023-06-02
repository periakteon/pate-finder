import React, { useState, useEffect } from "react";
import Image from "next/image";
import { myProfileAtom } from "@/pages/myprofile";
import { atom, useAtom } from "jotai";
import UpdateProfileModal from "./UpdateProfileModal";
import MyProfileHeaderDetailsModal from "./MyProfileHeaderDetailsModal";

export const isUpdateProfileModalOpenAtom = atom<boolean>(false);
export const isHeaderDetailsModalOpenAtom = atom<boolean>(false);

const MyProfileHeaderComponent: React.FC = () => {
  const [editProfile, setEditProfile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [myProfile, setMyProfile] = useAtom(myProfileAtom);
  const [isUpdateProfileModalOpen, setIsUpdateProfileModalOpen] = useAtom(
    isUpdateProfileModalOpenAtom,
  );
  const [isHeaderDetailsModalOpen, setIsHeaderDetailsModalOpen] = useAtom(
    isHeaderDetailsModalOpenAtom,
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMyProfile(myProfile);
  }, [myProfile, setMyProfile]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!myProfile) {
    return null;
  }

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
          className={`relative rounded-full overflow-hidden ${
            editProfile ? "scale-95" : ""
          } transition-transform duration-300`}
          onMouseOver={() => setEditProfile(true)}
          onMouseOut={() => setEditProfile(false)}
        >
          <Image
            src={myProfile.profile_picture || "/images/default.jpeg"}
            width={175}
            height={175}
            alt="profile picture"
            className={`rounded-full border-4 border-pink-500 dark:border-dark-border filter aspect-square object-cover ${
              editProfile ? "opacity-50" : ""
            }`}
          />
          {editProfile && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <button
                onClick={() => setIsUpdateProfileModalOpen(true)}
                className="bg-white rounded-full text-sm dark:text-dark-background px-4 py-2 animate-pulse"
              >
                Profilini Düzenle
              </button>
            </div>
          )}
        </div>
      )}
      <h1 className="text-2xl font-bold mt-4 transition-transform duration-300">
        {myProfile.username}
      </h1>
      <p className="text-gray-500 transition-transform duration-300">
        {myProfile.bio}
      </p>
      <div className="flex mt-4 pb-2">
        <div
          className="flex text-center hover:cursor-pointer transition-transform duration-300 p-3"
          onClick={() => setIsHeaderDetailsModalOpen(true)}
        >
          <div className="mr-4">
            <h2 className="text-lg font-bold transition-transform duration-300">
              Gönderiler
            </h2>
            <p className="text-gray-500 transition-transform duration-300">
              {myProfile.posts.length}
            </p>
          </div>
          <div className="mr-4">
            <h2 className="text-lg font-bold transition-transform duration-300">
              Takipçiler
            </h2>
            <p className="text-gray-500 transition-transform duration-300">
              {myProfile.followedBy.length}
            </p>
          </div>
          <div className="mr-4">
            <h2 className="text-lg font-bold transition-transform duration-300">
              Takip Edilenler
            </h2>
            <p className="text-gray-500 transition-transform duration-300">
              {myProfile.following.length}
            </p>
          </div>
          <div className="mr-4">
            <h2 className="text-lg font-bold transition-transform duration-300">
              Pet
            </h2>
            <p className="text-gray-500 transition-transform duration-300">
              {myProfile.pet && myProfile.pet.pet_photo ? (
                <Image
                  src={myProfile.pet.pet_photo}
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
      {isUpdateProfileModalOpen && <UpdateProfileModal />}
      {isHeaderDetailsModalOpen && <MyProfileHeaderDetailsModal />}
    </div>
  );
};

export default MyProfileHeaderComponent;
