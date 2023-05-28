import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useAtom } from "jotai";
import { z } from "zod";
import Image from "next/image";
import { myProfileAtom } from "@/pages/myprofile";
import { isUpdateProfileModalOpenAtom } from "./MyProfileHeader";
import { UpdateProfileRequestSchema } from "@/utils/zodSchemas";

Modal.setAppElement("#__next");

type UpdatedProfileType = z.infer<typeof UpdateProfileRequestSchema>;

const UpdateProfileModal: React.FC = () => {
  const [myProfile] = useAtom(myProfileAtom);
  const [isUpdateProfileModalOpen, setIsUpdateProfileModalOpen] = useAtom(
    isUpdateProfileModalOpenAtom,
  );
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [bio, setBio] = useState<string>("");

  useEffect(() => {
    if (myProfile) {
      setUsername(myProfile.username);
      setEmail(myProfile.email);
      setBio(myProfile.bio || "");
    }
  }, [myProfile]);

  if (!myProfile) {
    return null;
  }

  const handleUpdateProfile = async () => {
    try {
      const updatedFields: UpdatedProfileType = {};

      if (username !== myProfile.username) {
        updatedFields.username = username;
      }

      if (email !== myProfile.email) {
        updatedFields.email = email;
      }

      if (password !== "") {
        updatedFields.password = password;
      }

      if (bio !== myProfile.bio) {
        updatedFields.bio = bio;
      }

      const response = await fetch("/api/profile/updateProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });

      if (response.ok) {
        toast.success("Profil başarıyla güncellendi!", {
          draggable: false,
          autoClose: 1800,
        });
        setIsUpdateProfileModalOpen(false);
        return;
      } else {
        toast.error("Profil güncellenirken bir hata oluştu.", {
          draggable: false,
          autoClose: 1800,
        });
      }
    } catch (error) {
      console.log("Profil güncellenirken bir hata oluştu:", error);
      toast.error("Profil güncellenirken bir hata oluştu.", {
        draggable: false,
        autoClose: 1800,
      });
      return;
    }
  };

  return (
    <Modal
      isOpen={isUpdateProfileModalOpen}
      onRequestClose={() => setIsUpdateProfileModalOpen(false)}
      shouldCloseOnOverlayClick={true}
      contentLabel="Update Profile Modal"
      className="fixed inset-0 flex items-center justify-center overflow-auto z-[150]"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[151]"
    >
      <div className="w-1/3 h-5/6 bg-dark-dropzone flex overflow-y-scroll rounded-xl">
        <div className="flex flex-col items-center justify-center w-full p-4">
          <h2 className="text-xl font-semibold mb-4">Profilini Düzenle</h2>
          <form className="w-full max-w-sm">
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 font-medium mb-1"
              >
                Kullanıcı Adı
              </label>
              <input
                type="text"
                id="username"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                E-posta Adresi
              </label>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1"
              >
                Şifre
              </label>
              <input
                type="password"
                id="password"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="profilePicture"
                className="block text-gray-700 font-medium mb-1"
              >
                Profil Resmi
              </label>
              <input
                type="file"
                id="profilePicture"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                accept="image/*"
                onChange={(e) => {
                  // Resim seçildiğinde yapılacak işlemler burada gerçekleştirilebilir
                  // Örneğin, resmi yüklemek için bir API isteği yapabilirsiniz
                  const file = e.target.files[0];
                  setProfilePicture(file);
                }}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="bio"
                className="block text-gray-700 font-medium mb-1"
              >
                Bio
              </label>
              <textarea
                id="bio"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                value={bio}
                onChange={(e) => setBio(e.target.value || "")}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors duration-200"
                onClick={handleUpdateProfile}
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateProfileModal;
