import { useState } from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import { profileAtom } from "@/pages/profile/[username]";

const UsersProfileHeader = () => {
  const [addPicture, setAddPicture] = useState(false);
  const [profile] = useAtom(profileAtom);

  const handleMouseOver = () => {
    setAddPicture(true);
  };

  const handleMouseOut = () => {
    setAddPicture(false);
  };

  if (!profile) {
    return null;
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative rounded-full overflow-hidden"
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
      <h1 className="text-2xl font-bold mt-4">{profile.username}</h1>
      <p className="text-gray-500">{profile.pet?.bio}</p>
      <div className="flex mt-4">
        <div className="flex text-center">
          <div className="mr-4">
            <h2 className="text-lg font-bold">Posts</h2>
            <p className="text-gray-500">{profile.posts.length}</p>
          </div>
          <div className="mr-4">
            <h2 className="text-lg font-bold">Followers</h2>
            <p className="text-gray-500">{profile.followedBy.length}</p>
          </div>
          <div>
            <h2 className="text-lg font-bold">Following</h2>
            <p className="text-gray-500">{profile.following.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersProfileHeader;
