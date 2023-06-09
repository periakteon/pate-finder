import React, { useEffect, useState, ChangeEvent, CSSProperties } from "react";
import { useDropzone } from "react-dropzone";
import { useS3Upload } from "next-s3-upload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Image from "next/image";
import { atom, useAtom } from "jotai";
import { isModalOpenAtom } from "./sidebar";
import { BeatLoader } from "react-spinners";

// spinner CSS override
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "black",
};

const filesAtom = atom<File[]>([]);
const captionAtom = atom<string>("");
const countAtom = atom<number>(0);
const selectedFileURLAtom = atom<string>("");

const Dropzone: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [files, setFiles] = useAtom(filesAtom);
  const [selectedFileURL, setSelectedFileURL] = useAtom(selectedFileURLAtom);
  const [characterCount, setCharacterCount] = useAtom(countAtom);
  const [caption, setCaption] = useAtom(captionAtom);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const { uploadToS3 } = useS3Upload();
  const [, setIsModalOpen] = useAtom(isModalOpenAtom);

  const handleChangeCaption = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setCaption(value);
    setCharacterCount(value.length);
  };

  const handleDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    const fileURL = URL.createObjectURL(acceptedFiles[0]);
    setSelectedFileURL(fileURL);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: handleDrop,
  });

  const handleSubmit = async () => {
    if (!caption || caption.trim() === "") {
      toast.error("Lütfen bir içerik girin.", {
        draggable: false,
        autoClose: 1800,
      });
      return;
    }

    if (caption.trim().length > 280) {
      toast.error("İçerik en fazla 280 karakter olmalıdır.", {
        draggable: false,
        autoClose: 1800,
      });
      return;
    }

    if (files.length === 0) {
      toast.error("Lütfen bir görsel seçin.", {
        draggable: false,
        autoClose: 1800,
      });
      return;
    }

    if (uploading) {
      return;
    }

    try {
      setUploading(true); // Yükleme başladığında "uploading" true olarak ayarlanır

      const file = files[0];
      const { url } = await uploadToS3(file);
      setSelectedFileURL(url);

      const response = await fetch("/api/post/handlerPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caption,
          postImage: url,
        }),
      });

      if (response.ok) {
        toast.success("Gönderi başarıyla oluşturuldu!", {
          draggable: false,
          autoClose: 1800,
        });
      }

      if (response.status === 429) {
        return toast.error(
          "Bir saatte en fazla 30 gönderi oluşturabilirsiniz.",
          {
            draggable: false,
            autoClose: 1800,
          },
        );
      }
    } catch (error) {
      toast.error("Gönderi oluşturulurken bir hata oluştu.", {
        draggable: false,
        autoClose: 1800,
      });
    } finally {
      setUploading(false);
      setCaption("");
      setCharacterCount(0);
      setFiles([]);
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="container mx-auto w-fit flex flex-col rounded-lg items-center py-8 bg-light-background dark:bg-dark-background border">
        <button
          className="absolute top-4 right-4 bg-transparent rounded-full p-2 hover:bg-gray-200 transition duration-300 focus:outline-none"
          onClick={() => setIsModalOpen(false)}
        >
          <span className="h-6 w-6 text-red-600 hover:text-red-900 dark:text-gray-500 dark:hover:text-gray-700 text-lg">
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </button>
        <div
          {...getRootProps()}
          className={`w-3/5 mx-auto flex flex-col justify-center items-center bg-light-dropzoneBorder dark:bg-dark-dropzone border-4 border-dashed rounded-lg p-8 ${
            isDragActive || isDragging
              ? "border-pink-300 hover:border-pink-500 dark:border-gray-400 dark:hover:border-blue-500"
              : "border-pink-300 hover:border-pink-500 dark:border-gray-400 dark:hover:border-blue-500"
          }`}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
        >
          <input {...getInputProps()} />
          {!files.length ? (
            <>
              <FontAwesomeIcon
                icon={faFileUpload}
                className="text-pink-500 dark:text-gray-300 text-4xl mb-4"
              />
              <p className="text-sm text-center text-pink-500 font-bold dark:text-gray-400">
                Dosyalarınızı buraya sürükleyin veya seçmek için tıklayın.
              </p>
            </>
          ) : (
            <>
              <div className="relative">
                <Image
                  src={URL.createObjectURL(files[0])}
                  alt="Preview"
                  className="image-wrapper mt-2 max-h-80 object-contain"
                  width={600}
                  height={400}
                />
                <div
                  className="absolute top-0 right-0 cursor-pointer bg-gray-800 hover:bg-white rounded-full text-white p-1"
                  onClick={() => setFiles([])}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </div>
              </div>
            </>
          )}
        </div>
        <textarea
          value={caption}
          onChange={handleChangeCaption}
          className={`text-gray-800 dark:text-white w-3/5 h-32 mt-4 p-2 border-2 border-pink-400 dark:border-gray-200 bg-light-dropzoneBorder dark:bg-dark-dropzone rounded-lg resize-none ${
            characterCount > 280 ? "border-rose-500" : "border-slate-500"
          }`}
        />
        <div className="text-right w-3/5 text-gray-400 flex justify-end">
          <span
            className={`mb-2 ${characterCount > 280 ? "text-red-500" : ""}`}
          >
            {characterCount > 280 ? "-" : ""}
            {characterCount}/280
          </span>
        </div>
        {!uploading && (
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="w-3/5 mt-4 py-2 px-4 bg-pink-400 hover:bg-pink-300 dark:bg-slate-800 dark:hover:bg-slate-600 text-white rounded-lg"
          >
            Gönder
          </button>
        )}
        {uploading && (
          <div className="flex items-center justify-center mb-4">
            <BeatLoader
              cssOverride={override}
              size={15}
              color={"silver"}
              loading={uploading}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Dropzone;
