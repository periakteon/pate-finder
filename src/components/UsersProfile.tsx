import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { profileAtom } from "../pages/profile/[username]";
import Image from "next/image";

export default function UsersProfile() {
  const [profile, setProfile] = useAtom(profileAtom);

  return (
    <div className="flex flex-col items-center">
      <div className="relative rounded-full overflow-hidden">
        <Image
          src={"/images/default.jpeg"}
          width={175}
          height={175}
          alt="profile picture"
        />
      </div>
      <h1 className="text-2xl font-bold mt-4">{profile && profile.username}</h1>
      <p className="text-gray-500">{}</p>
      <div className="flex mt-4">
        <div className="flex text-center">
          <div className="mr-4">
            <h2 className="text-lg font-bold">Posts</h2>
            <p className="text-gray-500">{}</p>
          </div>
          <div className="mr-4">
            <h2 className="text-lg font-bold">Followers</h2>
            <p className="text-gray-500">{}</p>
          </div>
          <div>
            <h2 className="text-lg font-bold">Following</h2>
            <p className="text-gray-500">{}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
