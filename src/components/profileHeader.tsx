import { useState } from "react";
import profileTempData from "@/utils/profileTempData";
import Image from "next/image";
import { userAtom } from "@/pages/myprofile";
import { useAtom } from "jotai";

const ProfileHeader = () => {
  const [addPicture, setAddPicture] = useState(false);
  const [user] = useAtom(userAtom);

  if (!user) {
    return null;
  }
  console.log("user:", user)
  console.log("user:", user.username)



  const handleMouseOver = () => {
    setAddPicture(true);
  };

  const handleMouseOut = () => {
    setAddPicture(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative rounded-full overflow-hidden"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <Image
          src={profileTempData.profilePicture}
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
      <h1 className="text-2xl font-bold mt-4">{ }</h1>
      <p className="text-gray-500">{ }</p>
      <div className="flex mt-4">
        <div className="flex text-center">
          <div className="mr-4">
            <h2 className="text-lg font-bold">Posts</h2>
            <p className="text-gray-500">{ }</p>
          </div>
          <div className="mr-4">
            <h2 className="text-lg font-bold">Followers</h2>
            <p className="text-gray-500">{ }</p>
          </div>
          <div>
            <h2 className="text-lg font-bold">Following</h2>
            <p className="text-gray-500">{ }</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
