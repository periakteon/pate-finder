import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useAtom } from "jotai";
import { myProfileAtom } from "@/pages/myprofile";
import { isHeaderDetailsModalOpenAtom } from "./MyProfileHeader";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { handlerPetRequestSchema } from "@/utils/zodSchemas";
import { z } from "zod";
import { toast } from "react-toastify";

type EditedPet = z.infer<typeof handlerPetRequestSchema>;

Modal.setAppElement("#__next");

const MyProfileHeaderDetailsModal: React.FC = () => {
  const [myProfile, setMyProfile] = useAtom(myProfileAtom);
  const [isHeaderDetailsModalOpen, setIsHeaderDetailsModalOpen] = useAtom(
    isHeaderDetailsModalOpenAtom,
  );
  const [activeTab, setActiveTab] = useState<"followers" | "following" | "pet">(
    "followers",
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<EditedPet | null>(null);

  useEffect(() => {
    if (myProfile && myProfile.pet) {
      setEditedData({ ...myProfile.pet });
    }
  }, [myProfile]);

  if (!myProfile) {
    return null;
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setEditedData((prevData) => {
      if (prevData && prevData[name as keyof EditedPet] !== value) {
        return { ...prevData, [name]: value };
      }
      return prevData;
    });
  };

  const handleSaveChanges = async () => {
    if (editedData) {
      const response = await fetch("/api/pet/handlerPet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedData),
      });

      const responseData = await response.json();

      if (!responseData.success) {
        toast.error("Bir hata oluştu.", {
          draggable: false,
          autoClose: 1800,
        });
      }

      if (responseData.success) {
        toast.success("Değişiklikler kaydedildi.", {
          draggable: false,
          autoClose: 1800,
        });
      }

      setMyProfile((prevProfile) => {
        if (prevProfile && prevProfile.pet) {
          return {
            ...prevProfile,
            pet: {
              ...prevProfile.pet,
              ...editedData,
            },
          };
        }
        return prevProfile;
      });
      setIsEditing(false);
    }
  };

  const renderFollowers = () => {
    return myProfile.followedBy.map((follower) => (
      <div
        key={follower.follower.username}
        className="flex items-center my-3 dark:text-white"
      >
        <div className="mr-2">
          <Link
            href={`/profile/${follower.follower.username}`}
            onClick={() => setIsHeaderDetailsModalOpen(false)}
          >
            <Image
              src={follower.follower.profile_picture || "/images/default.jpeg"}
              alt="Profile Picture"
              width={64}
              height={64}
              className="rounded-full  aspect-square object-cover "
            />
          </Link>
        </div>
        <div>
          <Link
            href={`/profile/${follower.follower.username}`}
            onClick={() => setIsHeaderDetailsModalOpen(false)}
          >
            <h3 className="">{follower.follower.username}</h3>
          </Link>
        </div>
      </div>
    ));
  };

  const renderFollowing = () => {
    return myProfile.following.map((followed) => (
      <div
        key={followed.following.username}
        className="flex items-center my-3 dark:text-white"
      >
        <div className="mr-2">
          <Link
            href={`/profile/${followed.following.username}`}
            onClick={() => setIsHeaderDetailsModalOpen(false)}
          >
            <Image
              src={followed.following.profile_picture || "/images/default.jpeg"}
              alt="Profile Picture"
              width={64}
              height={64}
              className="rounded-full aspect-square object-cover "
            />
          </Link>
        </div>
        <div>
          <Link
            href={`/profile/${followed.following.username}`}
            onClick={() => setIsHeaderDetailsModalOpen(false)}
          >
            <h3>{followed.following.username}</h3>
          </Link>
        </div>
      </div>
    ));
  };

  const renderPet = () => {
    if (!myProfile.pet) {
      return (
        <>
          <p className="text-black dark:text-white">
            Pet bilgisi mevcut değil.
          </p>
          <Link href="/addpet">
            <button
              className="flex items-center mt-2 text-blue-500 dark:text-blue-400 focus:outline-none"
              onClick={() => setIsEditing(true)}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-1" />
              Pet Ekle!
            </button>
          </Link>
        </>
      );
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
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editedData?.name}
                className="w-full bg-transparent border-b border-gray-300 focus:outline-none"
                onChange={handleInputChange}
              />
            ) : (
              <>
                {myProfile.pet.name}
                <span className="ml-2" onClick={() => setIsEditing(true)}>
                  <FontAwesomeIcon icon={faEdit} />
                </span>
              </>
            )}
          </h3>
          <p className="text-gray-600 mb-2">
            <span className="font-bold text-black dark:text-white">Yaş:</span>{" "}
            <span className="text-gray-800 dark:text-gray-300">
              {isEditing ? (
                <input
                  type="text"
                  name="age"
                  value={editedData?.age}
                  className="w-full bg-transparent border-b border-gray-300 focus:outline-none"
                  onChange={handleInputChange}
                />
              ) : myProfile.pet.age ? (
                myProfile.pet.age
              ) : (
                "Belirtilmedi"
              )}
            </span>
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-bold text-black dark:text-white">Tür:</span>{" "}
            <span className="text-gray-800 dark:text-gray-300">
              {isEditing ? (
                <input
                  type="text"
                  name="type"
                  value={editedData?.type}
                  className="w-full bg-transparent border-b border-gray-300 focus:outline-none"
                  onChange={handleInputChange}
                />
              ) : (
                myProfile.pet.type
              )}
            </span>
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-bold text-black dark:text-white">Cins:</span>{" "}
            <span className="text-gray-800 dark:text-gray-300">
              {isEditing ? (
                <input
                  type="text"
                  name="breed"
                  value={editedData?.breed}
                  className="w-full bg-transparent border-b border-gray-300 focus:outline-none"
                  onChange={handleInputChange}
                />
              ) : (
                myProfile.pet.breed
              )}
            </span>
          </p>
          <p className="text-black dark:text-white">
            {isEditing ? (
              <textarea
                name="bio"
                value={editedData?.bio}
                className="w-full bg-transparent border-b border-gray-300 focus:outline-none"
                onChange={handleInputChange}
              />
            ) : (
              myProfile.pet.bio
            )}
          </p>
          {isEditing && (
            <button
              className="px-4 py-2 bg-pink-500 hover:bg-pink-400 dark:bg-blue-500 dark:hover:bg-blue-400 text-white rounded-lg mt-4"
              onClick={handleSaveChanges}
            >
              Kaydet
            </button>
          )}
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
      className="fixed inset-0 flex items-start justify-center overflow-auto z-[150] pt-20 ali pt-10"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[151]"
    >
      <div className="h-3/4 border-2 border-pink-400 dark:border-slate-700 rounded-md w-1/4 min-w-max bg-light-secondary dark:bg-dark-dropzone flex overflow-y-scroll">
        <button
          className="absolute top-4 right-4 bg-transparent rounded-full p-2 hover:bg-gray-200 transition duration-300 focus:outline-none"
          onClick={() => setIsHeaderDetailsModalOpen(false)}
        >
          <span className="text-red-600 hover:text-red-900 dark:text-gray-500 dark:hover:text-gray-700 text-lg">
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </button>
        <div className="w-full h-screen overflow-y-scroll">
          <div className="min-w-screen flex justify-center mb-4 sticky top-0 bg-white dark:bg-dark-primary z-10">
            <button
              className={`${
                activeTab === "followers"
                  ? "bg-pink-400 dark:bg-blue-500 text-white"
                  : "bg-light-dropzone dark:bg-dark-border dark:text-slate-300"
              } px-4 py-2 h-full flex-1`}
              onClick={() => setActiveTab("followers")}
            >
              Takipçiler
            </button>
            <button
              className={`${
                activeTab === "following"
                  ? "bg-pink-400 dark:bg-blue-500 text-white"
                  : "bg-light-dropzone dark:bg-dark-border dark:text-slate-300"
              } px-4 py-2 h-full flex-1`}
              onClick={() => setActiveTab("following")}
            >
              Takip
            </button>
            <button
              className={`${
                activeTab === "pet"
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

export default MyProfileHeaderDetailsModal;
