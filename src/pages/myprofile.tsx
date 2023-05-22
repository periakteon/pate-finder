import { useState } from "react";
import profileTempData from "@/utils/profileTempData";
import Image from "next/image";
import Sidebar from "@/components/sidebar";
import PostComponent from "@/components/post";
import ProfileHeader from "@/components/profileHeader";

const Profile = () => {

  return (
    <div className="flex">
      <Sidebar />
      <ProfileHeader />
      <h1>POSTLAR</h1>
      {/* <PostComponent/> */}
    </div>

  );
};

export default Profile;
