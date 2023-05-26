import { useState, useEffect } from "react";
import Image from "next/image";
import { profileAtom } from "@/pages/profile/[username]";
import { useAtom } from "jotai";

const UsersProfileHeaderComponent = () => {
  const [addPicture, setAddPicture] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profile, setprofile] = useAtom(profileAtom);
  console.log("Header gelen veri:", profile);

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

  if (!profile) {
    return null;
  }

  return (
    <div
      className={`${
        isScrolled ? "h-30 transform scale-100 transition-all duration-300" : ""
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
            src={profile.profile_picture || "/images/default.jpeg"}
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
        {profile.username}
      </h1>
      <p className="text-gray-500 transition-transform duration-300">
        {profile.pet?.bio}
      </p>
      <div className="flex mt-4">
        <div className="flex text-center">
          <div className="mr-4">
            <h2 className="text-lg font-bold transition-transform duration-300">
              Posts
            </h2>
            <p className="text-gray-500 transition-transform duration-300">
              {profile.posts.length}
            </p>
          </div>
          <div className="mr-4">
            <h2 className="text-lg font-bold transition-transform duration-300">
              Followers
            </h2>
            <p className="text-gray-500 transition-transform duration-300">
              {profile.followedBy.length}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold transition-transform duration-300">
              Following
            </h2>
            <p className="text-gray-500 transition-transform duration-300">
              {profile.following.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersProfileHeaderComponent;