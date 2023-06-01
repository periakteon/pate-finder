import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useAtom } from "jotai";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEdit } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { profileAtom } from "@/pages/profile/[username]";
import { isUserHeaderDetailsModalOpenAtom } from "./UsersProfileHeader";

Modal.setAppElement("#__next");

const UsersProfileHeaderDetailsModal: React.FC = () => {
  const [profile, setProfile] = useAtom(profileAtom);
  const [isUserHeaderDetailsModalOpen, setIsUserHeaderDetailsModalOpen] =
    useAtom(isUserHeaderDetailsModalOpenAtom);
  const [activeTab, setActiveTab] = useState<"followers" | "following" | "pet">(
    "followers",
  );

  if (!profile) {
    return null;
  }

  const renderFollowers = () => {
    return profile.followedBy.map((follower) => (
      <div key={follower.follower.username} className="flex items-center my-3">
        <div className="mr-2">
          <Link
            href={`/profile/${follower.follower.username}`}
            onClick={() => setIsUserHeaderDetailsModalOpen(false)}
          >
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
          <Link
            href={`/profile/${follower.follower.username}`}
            onClick={() => setIsUserHeaderDetailsModalOpen(false)}
          >
            <h3 className="">{follower.follower.username}</h3>
          </Link>
        </div>
      </div>
    ));
  };

  const renderFollowing = () => {
    return profile.following.map((followed) => (
      <div key={followed.following.username} className="flex items-center my-3">
        <div className="mr-2">
          <Link
            href={`/profile/${followed.following.username}`}
            onClick={() => setIsUserHeaderDetailsModalOpen(false)}
          >
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
          <Link
            href={`/profile/${followed.following.username}`}
            onClick={() => setIsUserHeaderDetailsModalOpen(false)}
          >
            <h3>{followed.following.username}</h3>
          </Link>
        </div>
      </div>
    ));
  };

  const renderPet = () => {
    if (!profile.pet) {
      return <p>Pet bilgisi mevcut değil.</p>;
    }

    return (
      <div className="flex flex-col items-center my-3">
        <div className="relative w-32 h-32">
          <Image
            src={profile.pet.pet_photo || "/images/default.jpeg"}
            alt="Pet Photo"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold text-center mb-3">
            {profile.pet.name}
          </h3>
          <p className="text-gray-600 mb-2">
            <span className="font-bold text-black dark:text-white">Yaş:</span>{" "}
            <span className="text-gray-800 dark:text-gray-300">
              {profile.pet.age ? profile.pet.age : "Belirtilmedi"}
            </span>
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-bold text-black dark:text-white">Tür:</span>{" "}
            <span className="text-gray-800 dark:text-gray-300">
              {profile.pet.type}
            </span>
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-bold text-black dark:text-white">Cins:</span>{" "}
            <span className="text-gray-800 dark:text-gray-300">
              {profile.pet.breed}
            </span>
          </p>
          <p className="text-black dark:text-white">{profile.pet.bio}</p>
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
      isOpen={isUserHeaderDetailsModalOpen}
      onRequestClose={() => setIsUserHeaderDetailsModalOpen(false)}
      shouldCloseOnOverlayClick={true}
      contentLabel="Comments Modal"
      className="fixed inset-0 flex items-center justify-center overflow-auto z-[150]"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[151]"
    >
      <div className="h-3/4 w-1/4 bg-light-secondary dark:bg-dark-dropzone rounded-md border-2 border-black flex overflow-y-scroll">
        <button
          className="absolute top-4 right-4 bg-transparent rounded-full p-2 hover:bg-gray-200 transition duration-300 focus:outline-none"
          onClick={() => setIsUserHeaderDetailsModalOpen(false)}
        >
          <span className="text-red-600 hover:text-red-900 dark:text-gray-500 dark:hover:text-gray-700 text-lg">
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </button>
        <div className="w-full h-screen overflow-y-scroll">
          <div className="min-w-screen flex justify-center mb-4 sticky top-0 bg-white dark:bg-dark-primary z-10">
            <button
              className={`${activeTab === "followers"
                ? "bg-pink-400 dark:bg-blue-500 text-white"
                : "bg-light-dropzone dark:bg-dark-border dark:text-slate-300"
                } px-4 py-2 h-full flex-1`}
              onClick={() => setActiveTab("followers")}
            >
              Takipçiler
            </button>
            <button
              className={`${activeTab === "following"
                ? "bg-pink-400 dark:bg-blue-500 text-white"
                : "bg-light-dropzone dark:bg-dark-border dark:text-slate-300"
                } px-4 py-2 h-full flex-1`}
              onClick={() => setActiveTab("following")}
            >
              Takip
            </button>
            <button
              className={`${activeTab === "pet"
                ? "bg-pink-400 dark:bg-blue-500 text-white"
                : "bg-light-dropzone dark:bg-dark-border dark:text-slate-300"
                } px-4 py-2 h-full flex-1`}
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

export default UsersProfileHeaderDetailsModal;
