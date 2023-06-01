import { useState, useEffect } from "react";
import Image from "next/image";
import { profileAtom } from "@/pages/profile/[username]";
import { atom, useAtom } from "jotai";
import UsersProfileHeaderDetailsModal from "./UsersProfileHeaderDetailsModal";

export const isUserHeaderDetailsModalOpenAtom = atom<boolean>(false);

const UsersProfileHeaderComponent: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [profile] = useAtom(profileAtom);
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

  return (
    <div
      className={`${isScrolled ? "h-30 transform scale-100 transition-all duration-300" : ""
        } flex flex-col items-center w-full sticky top-0  bg-light-primary dark:bg-dark-background backdrop-blur-sm bg-opacity-80 z-[100]`}
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
          />
        </div>
      )}
      <h1 className="text-2xl font-bold mt-4 transition-transform duration-300">
        {profile.username}
      </h1>
      <button
        className={
          "bg-light-dropzone hover:bg-pink-300 dark:bg-dark-border dark:text-slate-300 dark:hover:bg-dark-hover px-4 py-2 rounded-md mt-2"
        }
      >Takip Et</button>
      <p className="text-gray-500 transition-transform duration-300">
        {profile.bio}
      </p>
      <div className="flex mt-4 pb-2">
        <div
          className="flex text-center hover:cursor-pointer transition-transform duration-300"
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
              )}{" "}
            </p>
          </div>
        </div>
      </div>
      {isUserHeaderDetailsModalOpen && <UsersProfileHeaderDetailsModal />}
    </div>
  );
};

export default UsersProfileHeaderComponent;
