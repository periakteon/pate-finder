import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { profileAtom } from "../pages/profile/[username]";

export default function UsersProfile() {
  const [profile, setProfile] = useAtom(profileAtom);
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex flex-row">
      <div>
        Bileşendeki kullanıcı: {profile}
      </div>
    </div>
  );
}
