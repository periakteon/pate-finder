import React, { useState, useEffect, CSSProperties, ChangeEvent } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useAtom } from "jotai";
import { z } from "zod";
import { useS3Upload } from "next-s3-upload";
import { myProfileAtom } from "@/pages/myprofile";
import { isUpdateProfileModalOpenAtom } from "./MyProfileHeader";
import {
  UpdateProfileRequestSchema,
  UpdatedUserSchema,
} from "@/utils/zodSchemas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { BeatLoader } from "react-spinners";

Modal.setAppElement("#__next");

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "black",
};

type UpdatedProfileType = z.infer<typeof UpdateProfileRequestSchema>;

const UpdateProfileModal: React.FC = () => {
  const [myProfile, setMyProfile] = useAtom(myProfileAtom);
  const [isUpdateProfileModalOpen, setIsUpdateProfileModalOpen] = useAtom(
    isUpdateProfileModalOpenAtom,
  );
  const { uploadToS3 } = useS3Upload();
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFileURL, setSelectedFileURL] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null | undefined>(null);
  const [email, setEmail] = useState<string | null | undefined>(null);
  const [password, setPassword] = useState<any>("");
  const [, setProfilePicture] = useState("");
  const [bio, setBio] = useState<string | null | undefined>(null);

  useEffect(() => {
    if (myProfile) {
      setUsername(myProfile.username || "");
      setEmail(myProfile.email);
      setProfilePicture(myProfile.profile_picture || "");
      setBio(myProfile.bio || "");
    }
  }, [myProfile]);

  if (!myProfile) {
    return null;
  }

  const onProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles([file]);
      setSelectedFileURL(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setUploading(true);

      const updatedFields: UpdatedProfileType = {};

      if (files.length > 0) {
        const file = files[0];
        const { url } = await uploadToS3(file);
        setSelectedFileURL(url);
        updatedFields.profile_picture = url;
      }

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

      const parsedFields = UpdateProfileRequestSchema.parse(updatedFields);
      const response = await fetch("/api/profile/updateProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedFields),
      });

      const responseData = await response.json();

      if (!responseData.success) {
        toast.error(responseData.message, {
          draggable: false,
          autoClose: 1800,
        });
        return;
      }

      if (responseData.success) {
        const updatedData = responseData.updatedUser;
        setMyProfile((prevProfile) => ({ ...prevProfile, ...updatedData }));
        toast.success("Profil başarıyla güncellendi.", {
          draggable: false,
          autoClose: 1800,
        });
        setIsUpdateProfileModalOpen(false);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues
          .map((issue) => issue.message)
          .join(" ");
        toast.error(`Profil güncellenirken bir hata oluştu: ${errorMessage}`, {
          draggable: false,
          autoClose: 1800,
        });
        return;
      }
    } finally {
      setUploading(false);
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
      <div className="w-1/3 h-5/6 bg-light-secondary dark:bg-dark-dropzone flex overflow-y-scroll rounded-xl">
        <div className="flex flex-col items-center justify-center w-full p-4 relative">
          <h2 className="text-xl font-semibold mb-4">Profilini Düzenle</h2>
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setIsUpdateProfileModalOpen(false)}
          >
            <FontAwesomeIcon
              icon={faTimes}
              className="text-xl hover:scale-110 transition-transform"
            />
          </button>
          <form className="w-full max-w-sm">
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-500 font-medium mb-1"
              >
                Kullanıcı Adı
              </label>
              <input
                type="text"
                id="username"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                value={username || ""}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-500 font-medium mb-1"
              >
                E-posta Adresi
              </label>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-500 font-medium mb-1"
              >
                Şifre
              </label>
              <input
                type="password"
                id="password"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                value={password || ""}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="profilePicture"
                className="block text-gray-500 font-medium mb-1"
              >
                Profil Resmi
              </label>
              <input
                type="file"
                id="profilePicture"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                accept="image/*"
                onChange={onProfilePictureChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="bio"
                className="block text-gray-500 font-medium mb-1"
              >
                Bio
              </label>
              <textarea
                id="bio"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                value={bio || ""}
                onChange={(e) => setBio(e.target.value || "")}
              />
            </div>
            <div className="flex justify-end">
              {uploading ? (
                <div className="flex mx-auto items-center justify-center mb-4">
                  <BeatLoader
                    cssOverride={override}
                    size={15}
                    color={"silver"}
                    loading={uploading}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  className="px-4 py-2 rounded-md bg-pink-300 hover:bg-pink-500 dark:bg-blue-500 text-white font-medium dark:hover:bg-blue-600 transition-colors duration-200"
                  onClick={handleUpdateProfile}
                  disabled={uploading}
                >
                  Kaydet
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateProfileModal;
