import { useState } from "react";
import { useS3Upload, getImageData } from "next-s3-upload";
import { toast } from "react-toastify";
import Image from "next/image";

export default function UploadComponent() {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [height, setHeight] = useState<number | undefined>();
  const [width, setWidth] = useState<number | undefined>();
  const { FileInput, openFileDialog, uploadToS3, files } = useS3Upload();

  const handleFileChange = async (file: File) => {
    try {
      const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

      if (!allowedFileTypes.includes(file.type)) {
        toast.error("Dosya tipi uygun değil", {
          draggable: false,
          autoClose: 1800,
        });
        return;
      }

      const { url } = await uploadToS3(file);
      const { height, width } = await getImageData(file);
      setWidth(width);
      setHeight(height);
      setImageUrl(url);
      console.log("URL", url);
      toast.success("Dosya yüklendi!", {
        draggable: false,
        autoClose: 1800,
      });
      console.log("url", url);
    } catch (error) {
      toast.error(`Dosya yüklemek için giriş yapmanız gerekmektedir.`, {
        draggable: false,
        autoClose: 1800,
      });
    }
  };

  return (
    <div>
      <FileInput onChange={handleFileChange} />

      <button onClick={openFileDialog}>Upload file</button>
      <div className="pt-8">
        {files.map((file, index) => (
          <div key={index}>
            File #{index} progress: {file.progress}
            <div
              style={{
                width: `${file.progress}%`,
                maxWidth: "250px",
                height: "5px",
                backgroundColor: "green",
              }}
            ></div>
          </div>
        ))}
      </div>
      {height && width && `${height}x${width}`}
      {imageUrl && <Image src={imageUrl} width={width} height={height} alt="Uploaded image" />}
    </div>
  );
}