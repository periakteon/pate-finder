import { useEffect } from "react";
import { useRouter } from "next/router";
import UsersProfile from "../../components/UsersProfile";
import Sidebar from "@/components/sidebar";
import { atom, useAtom } from "jotai";

export const profileAtom = atom<string | string[]>("");

const ProfilePage = () => {
  const router = useRouter();
  const { username }  = router.query;
  const [profile, setProfile] = useAtom(profileAtom);

  useEffect(() => {
    if (username) {
      setProfile(username);
    }
  }, [username, setProfile]);
  
  return (
    <div className="flex flex-row">
      <div>
        <Sidebar />
      </div>
      <div>
        Username: {username}
        User: {profile}
      </div>
      <div>
        <UsersProfile />
      </div>
    </div>
  );
};

export default ProfilePage;
