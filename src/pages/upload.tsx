import { useState, CSSProperties } from "react";
import { useS3Upload, getImageData } from "next-s3-upload";
import { toast } from "react-toastify";
import Image from "next/image";
import { BeatLoader } from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "black",
};

export default function UploadComponent() {
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

  return (
    <div>
      <FileInput onChange={handleFileChange} />

      <button onClick={openFileDialog}>Dosya Seç</button>
      <br />
      <button onClick={handleUpload} disabled={buttonDisabled}>
        Yükle
      </button>

      <div className="pt-8">
        {uploading && (
          <div>
            <BeatLoader
              cssOverride={override}
              size={15}
              color={"fuchsia"}
              loading={uploading}
            />
          </div>
        )}
      </div>

      {imageUrl && (
        <div className="relative">
          <div
            className="relative top-2 right-2 flex items-center justify-center w-6 h-6 bg-black text-white border border-white rounded-full cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
            onClick={handleDelete}
          >
            X
          </div>
          <div className="relative">
            <Image
              src={imageUrl}
              width={width}
              height={height}
              alt="Uploaded image"
            />
          </div>
          {height && width && `${height}x${width}`}
        </div>
      )}
    </div>
  );
}
