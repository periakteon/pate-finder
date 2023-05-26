import { useState, useEffect } from "react";
import Image from "next/image";
import { myProfileAtom } from "@/pages/myprofile";
import { useAtom } from "jotai";

const MyProfileHeaderComponent = () => {
  const [addPicture, setAddPicture] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [myProfile, setMyProfile] = useAtom(myProfileAtom);

  const handleMouseOver = () => {
    setAddPicture(true);
  };

  const handleMouseOut = () => {
    setAddPicture(false);
  };

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
        isScrolled ? "h-30 border-b-2 border-b-dark-border" : ""
      } flex flex-col items-center w-full sticky top-0 bg-dark-background backdrop-blur-sm bg-opacity-80 z-[100]`}
    >
      {!isScrolled && (
        <div
          className={`relative rounded-full overflow-hidden ${
            addPicture ? "scale-95" : ""
          } transition-transform duration-300`}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <Image
            src={myProfile.profile_picture || "/images/default.jpeg"}
            width={175}
            height={175}
            alt="profile picture"
            className={`filter ${addPicture ? "opacity-50" : ""}`}
          />
          {addPicture && (
            <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <button className="bg-white rounded-full text-sm text-purple-500 px-4 py-2">
                Fotoğraf Ekle
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
        <div className="flex text-center">
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
          <div>
            <h2 className="text-lg font-bold transition-transform duration-300">
              Takip Edilenler
            </h2>
            <p className="text-gray-500 transition-transform duration-300">
              {myProfile.following.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfileHeaderComponent;
