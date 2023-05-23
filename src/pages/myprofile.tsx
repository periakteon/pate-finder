import Sidebar from "@/components/sidebar";
import ProfileHeader from "@/components/profileHeader";
import ProfilePosts from "@/components/profilePosts";

const Profile = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col items-center">
        <ProfileHeader />
        <ProfilePosts />
      </div>
    </div>
  );
};

export default Profile;
