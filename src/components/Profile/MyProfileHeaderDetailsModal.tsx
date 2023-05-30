import React, { useState } from "react";
import Modal from "react-modal";
import { useAtom } from "jotai";
import { myProfileAtom } from "@/pages/myprofile";
import { isHeaderDetailsModalOpenAtom } from "./MyProfileHeader";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

Modal.setAppElement("#__next");

const MyProfileHeaderDetailsModal: React.FC = () => {
  const [myProfile, setMyProfile] = useAtom(myProfileAtom);
  const [isHeaderDetailsModalOpen, setIsHeaderDetailsModalOpen] = useAtom(
    isHeaderDetailsModalOpenAtom,
  );
  const [activeTab, setActiveTab] = useState<"followers" | "following" | "pet">(
    "followers",
  );

  if (!myProfile) {
    return null;
  }

  const renderFollowers = () => {
    return myProfile.followedBy.map((follower) => (
      <div key={follower.follower.username} className="flex items-center my-3">
        <div className="mr-2">
          <Link href={`/profile/${follower.follower.username}`}>
            <Image
              src={follower.follower.profile_picture || "/images/default.jpeg"}
              alt="Profile Picture"
              width={64}
              height={64}
              className="rounded-full"
            />
          </Link>
        </div>
        <div>
          <Link href={`/profile/${follower.follower.username}`}>
            <h3 className="">{follower.follower.username}</h3>
          </Link>
        </div>
      </div>
    ));
  };

  const renderFollowing = () => {
    return myProfile.following.map((followed) => (
      <div key={followed.following.username} className="flex items-center my-3">
        <div className="mr-2">
          <Link href={`/profile/${followed.following.username}`}>
            <Image
              src={followed.following.profile_picture || "/images/default.jpeg"}
              alt="Profile Picture"
              width={64}
              height={64}
              className="rounded-full"
            />
          </Link>
        </div>
        <div>
          <Link href={`/profile/${followed.following.username}`}>
            <h3>{followed.following.username}</h3>
          </Link>
        </div>
      </div>
    ));
  };

  const renderPet = () => {
    if (!myProfile.pet) {
      return <p>Pet bilgisi mevcut değil.</p>;
    }

    return (
      <div className="flex flex-col items-center my-3">
        <div className="relative w-32 h-32">
          <Image
            src={myProfile.pet.pet_photo || "/images/default.jpeg"}
            alt="Pet Photo"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold text-center mb-3">
            {myProfile.pet.name}
          </h3>
          <p className="text-gray-600 mb-2">
            <span className="font-bold text-black dark:text-white">Yaş:</span>{" "}
            <span className="text-gray-800 dark:text-gray-300">
              {myProfile.pet.age ? myProfile.pet.age : "Belirtilmedi"}
            </span>
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-bold text-black dark:text-white">Tür:</span>{" "}
            <span className="text-gray-800 dark:text-gray-300">
              {myProfile.pet.type}
            </span>
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-bold text-black dark:text-white">Cins:</span>{" "}
            <span className="text-gray-800 dark:text-gray-300">
              {myProfile.pet.breed}
            </span>
          </p>
          <p className="text-black dark:text-white">{myProfile.pet.bio}</p>
        </div>
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
      <div className="h-full w-1/4 bg-dark-dropzone flex overflow-y-scroll">
        <button
          className="absolute top-4 right-4 bg-transparent rounded-full p-2 hover:bg-gray-200 transition duration-300 focus:outline-none"
          onClick={() => setIsHeaderDetailsModalOpen(false)}
        >
          <span className="h-6 w-6 text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </button>
        <div className="w-full h-screen overflow-y-scroll">
          <div className="min-w-screen flex justify-center mb-4">
            <button
              className={`${
                activeTab === "followers"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              } px-4 py-2 rounded-tl-lg h-full flex-1`}
              onClick={() => setActiveTab("followers")}
            >
              Takipçiler
            </button>
            <button
              className={`${
                activeTab === "following"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              } px-4 py-2 h-full flex-1`}
              onClick={() => setActiveTab("following")}
            >
              Takip
            </button>
            <button
              className={`${
                activeTab === "pet"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              } px-4 py-2 rounded-tr-lg h-full flex-1`}
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
