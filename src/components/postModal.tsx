import React, { useState, CSSProperties } from "react";
import { useS3Upload, getImageData } from "next-s3-upload";
import { toast } from "react-toastify";
import Image from "next/image";
import { BeatLoader } from "react-spinners";
import Modal from "react-modal";

Modal.setAppElement("#__next");

type PostModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "black",
};

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [height, setHeight] = useState<number | undefined>();
  const [width, setWidth] = useState<number | undefined>();
  const { FileInput, openFileDialog, uploadToS3 } = useS3Upload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

  const handleFileChange = async (file: File) => {
    try {
      const allowedFileTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];

      if (!allowedFileTypes.includes(file.type)) {
        toast.error("Dosya tipi uygun değil", {
          draggable: false,
          autoClose: 1800,
        });
        return;
      }

      const { height, width } = await getImageData(file);
      setWidth(width);
      setHeight(height);
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
      setSelectedFile(file);
    } catch (error) {
      toast.error("Dosya yüklenirken bir hata oluştu.", {
        draggable: false,
        autoClose: 1800,
      });
    }
  };

  const handleUpload = async () => {
    try {
      if (!selectedFile) {
        toast.error("Lütfen bir dosya seçin.", {
          draggable: false,
          autoClose: 1800,
        });
        return;
      }

      if (uploading) {
        return;
      }

      setUploading(true);
      setButtonDisabled(true);

      const { url } = await uploadToS3(selectedFile);
      setImageUrl(url);
      toast.success("Dosya yüklendi!", {
        draggable: false,
        autoClose: 1800,
      });
    } catch (error) {
      toast.error("Dosya yüklenirken bir hata oluştu.", {
        draggable: false,
        autoClose: 1800,
      });
    } finally {
      setUploading(false);
      setButtonDisabled(false);
    }
  };

  const handleDelete = () => {
    setImageUrl("");
    setHeight(undefined);
    setWidth(undefined);
    setSelectedFile(null);
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setContent(event.target.value);
  };

  const handleSubmit = async () => {
    if (!content || content.trim() === "") {
      toast.error("Lütfen bir içerik girin.", {
        draggable: false,
        autoClose: 1800,
      });
      return;
    }

    if (content.trim().length > 280) {
      toast.error("İçerik en fazla 280 karakter olmalıdır.", {
        draggable: false,
        autoClose: 1800,
      });
      return;
    }

    if (
      !imageUrl ||
      !imageUrl.includes(
        "https://pate-finder-pre-signed-url.s3.us-east-1.amazonaws.com/",
      )
    ) {
      toast.error("Lütfen bir görsel seçin ve görseli sunucuya yükleyin.", {
        draggable: false,
        autoClose: 1800,
      });
      return;
    }

    try {
      const response = await fetch("/api/post/handlerPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caption: content,
          postImage: imageUrl,
        }),
      });

      if (response.ok) {
        toast.success("Gönderi başarıyla oluşturuldu!", {
          draggable: false,
          autoClose: 1800,
        });
        onClose();
      } else {
        toast.error("Gönderi oluşturulurken bir hata oluştu.", {
          draggable: false,
          autoClose: 1800,
        });
      }
    } catch (error) {
      toast.error("Gönderi oluşturulurken bir hata oluştu.", {
        draggable: false,
        autoClose: 1800,
      });
    }
  };

  const characterCount = content.length;
  const isContentTooLong = characterCount > 280;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
      contentLabel="Post Modal"
      className="fixed inset-0 flex items-center justify-center overflow-auto z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-49"
    >
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
        <div className="max-h-[80vh] overflow-auto">
          <div className="flex flex-row justify-between items-start mb-3 relative">
            <h2 className="mb-4 text-2xl font-bold text-black">Gönderi Ekle</h2>
            <button
              className="absolute top-0 right-0 px-4 py-2 bg-gray-300 rounded-full cursor-pointer"
              onClick={onClose}
            >
              X
            </button>
          </div>
          <textarea
            placeholder="Gönderi İçeriği"
            value={content}
            onChange={handleContentChange}
            className="mb-1 px-4 py-2 border border-gray-300 rounded-md w-full"
            rows={4}
          />
          <div
            className={`flex justify-end text-gray-400 ${
              isContentTooLong ? "text-red-500" : ""
            }`}
          >
            <span className="mb-2">
              {isContentTooLong ? "-" : ""}
              {characterCount}
            </span>
            <span>/</span>
            <span>280</span>
          </div>
          <FileInput onChange={handleFileChange} />
          <button
            onClick={openFileDialog}
            className="w-full cursor-pointer px-4 py-2 bg-slate-500 hover:bg-slate-400 text-white mb-2 rounded-md"
          >
            Görsel Seç
          </button>
          <br />
          <button
            onClick={handleUpload}
            disabled={buttonDisabled}
            className="w-full cursor-pointer px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-md"
          >
            Görseli Yükle
          </button>
          <div className="pt-8">
            {uploading && (
              <div className="flex items-center justify-center mb-4">
                <BeatLoader
                  cssOverride={override}
                  size={15}
                  color={"green"}
                  loading={uploading}
                />
              </div>
            )}
          </div>
          {imageUrl && (
            <div className="relative border-dashed border-2 mb-4 p-4">
              <div
                className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 bg-black text-white border border-white rounded-full cursor-pointer opacity-50 hover:opacity-100 transition-opacity z-10"
                onClick={handleDelete}
              >
                X
              </div>
              <div className="relative flex items-center justify-center">
                <Image
                  src={imageUrl}
                  width={400}
                  height={400}
                  alt="Uploaded image"
                />
              </div>
            </div>
          )}
          <button
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-md cursor-pointer"
            onClick={handleSubmit}
          >
            Gönderi Oluştur
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PostModal;
