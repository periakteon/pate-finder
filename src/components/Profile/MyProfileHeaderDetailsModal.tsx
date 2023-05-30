import React, { useState } from "react";
import Modal from "react-modal";
import { useAtom } from "jotai";
import { myProfileAtom } from "@/pages/myprofile";
import { isHeaderDetailsModalOpenAtom } from "./MyProfileHeader";
import Image from "next/image";

Modal.setAppElement("#__next");

const MyProfileHeaderDetailsModal: React.FC = () => {
  const [myProfile, setMyProfile] = useAtom(myProfileAtom);
  const [isHeaderDetailsModalOpen, setIsHeaderDetailsModalOpen] = useAtom(
    isHeaderDetailsModalOpenAtom
  );
  const [activeTab, setActiveTab] = useState<"followers" | "following" | "pet">(
    "followers"
  );

  if (!myProfile) {
    return null;
  }

  const renderFollowers = () => {
    return myProfile.followedBy.map((follower) => (
      <div key={follower.follower.username}>
        <h3>{follower.follower.username}</h3>
        <Image src={follower.follower.profile_picture || "/images/default.jpeg"} alt="Profile Picture" width={64} height={64}/>
      </div>
    ));
  };

  const renderFollowing = () => {
    return myProfile.following.map((followed) => (
      <div key={followed.following.username}>
        <h3>{followed.following.username}</h3>
        <Image src={followed.following.profile_picture || "/images/default.jpeg"} alt="Profile Picture" width={64} height={64}/>
      </div>
    ));
  };

  const renderPet = () => {
    if (!myProfile.pet) {
      return <p>No pet information available.</p>;
    }

    return (
      <div>
        <h3>{myProfile.pet.name}</h3>
        <p>Breed: {myProfile.pet.breed}</p>
        <Image src={myProfile.pet.pet_photo || "/images/default.jpeg"} alt="Pet Photo" width={64} height={64}/>
        <p>Type: {myProfile.pet.type}</p>
        <p>Bio: {myProfile.pet.bio}</p>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "followers":
        return renderFollowers();
      case "following":
        return renderFollowing();
      case "pet":
        return renderPet();
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isHeaderDetailsModalOpen}
      onRequestClose={() => setIsHeaderDetailsModalOpen(false)}
      shouldCloseOnOverlayClick={true}
      contentLabel="Comments Modal"
      className="fixed inset-0 flex items-center justify-center overflow-auto z-[150]"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[151]"
    >
      <div className="w-2/3 h-full bg-dark-dropzone flex overflow-y-scroll">
        <div className="w-full">
          <div className="flex justify-center mb-4">
            <button
              className={`${
                activeTab === "followers" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
              } px-4 py-2 rounded-tl-lg`}
              onClick={() => setActiveTab("followers")}
            >
              Takipçiler
            </button>
            <button
              className={`${
                activeTab === "following" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
              } px-4 py-2`}
              onClick={() => setActiveTab("following")}
            >
              Takip Edilenler
            </button>
            <button
              className={`${
                activeTab === "pet" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
              } px-4 py-2 rounded-tr-lg`}
              onClick={() => setActiveTab("pet")}
            >
              Pet
            </button>
          </div>
          <div className="p-4">{renderTabContent()}</div>
        </div>
      </div>
    </Modal>
  );
};

export default MyProfileHeaderDetailsModal;
