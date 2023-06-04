import React, { useState, useEffect, CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { z } from "zod";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { useS3Upload } from "next-s3-upload";
import { useDropzone } from "react-dropzone";
import { faFileUpload, faTimes } from "@fortawesome/free-solid-svg-icons";
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from "next/router";
import { PrismaClient } from "@prisma/client";
import { verifyJwtToken } from "@/utils/verifyJwtToken";
import cookie from "cookie";

const prisma = new PrismaClient();

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "black",
};

const PetSchema = z.object({
  name: z.string({
    invalid_type_error: "Lütfen geçerli bir isim giriniz.",
    required_error: "Lütfen bir isim giriniz.",
  }),
  breed: z.string({
    invalid_type_error: "Lütfen geçerli bir cins giriniz.",
    required_error: "Lütfen bir cins giriniz.",
  }),
  age: z.string({
    invalid_type_error: "Lütfen geçerli bir yaş giriniz.",
    required_error: "Lütfen bir yaş giriniz.",
  }),
  pet_photo: z
    .string({
      invalid_type_error: "Lütfen geçerli bir fotoğraf yükleyiniz.",
      required_error: "Lütfen bir fotoğraf ekleyiniz.",
    })
    .url().nullable(),
  type: z.string({
    invalid_type_error: "Lütfen geçerli bir tür giriniz.",
    required_error: "Lütfen bir tür giriniz.",
  }),
  bio: z.string({
    invalid_type_error: "Lütfen geçerli bir bio giriniz.",
    required_error: "Lütfen bir bio giriniz.",
  }),
});

type Pet = z.infer<typeof PetSchema>;

const AddPet = () => {
  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);
  const [selectedFileURL, setSelectedFileURL] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const { uploadToS3 } = useS3Upload();
  const [pet, setPet] = useState<Pet>({
    name: "",
    breed: "",
    age: "0",
    pet_photo: "http://image.com/512.jpg",
    type: "",
    bio: "",
  });

  console.log("selected file url", selectedFileURL);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedPet = { ...pet, [name]: value };
    setPet(updatedPet);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = PetSchema.safeParse(pet);

    if (!parsed.success) {
      const errorMap = parsed.error.flatten().fieldErrors;
      const errorMessages = Object.values(errorMap).flatMap(
        (errors) => errors ?? [],
      );

      toast.error(`Hata: ${errorMessages}`);
    }

    if (parsed.success) {
      setPet(parsed.data);
    }

    try {
      const file = files?.[0];
      const { url } = await uploadToS3(file);
      setSelectedFileURL(url);
      const response = await fetch("/api/pet/handlerPet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: pet.name,
          breed: pet.breed,
          age: pet.age,
          type: pet.type,
          bio: pet.bio,
          pet_photo: url,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success("Pet başarıyla eklendi!", {
          draggable: false,
          autoClose: 1800,
        });
      }

    } catch (error) {
      toast.error("Pet eklenirken bir hata oluştu.", {
        draggable: false,
        autoClose: 1800,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-400 to-purple-600 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 selection:bg-rose-500 selection:text-white">
      <Image
        src="/logo/png/logo-no-background.png"
        width={125}
        height={125}
        alt="logo"
        className="flex self-start absolute top-0 left-0 mt-5 ml-5"
      />
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-rose-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="backdrop-blur-sm bg-white/80 rounded-md p-8 w-96">
          <h2 className="text-4xl font-bold mb-10 flex justify-center text-rose-900">
            Evcil Hayvan Ekle
          </h2>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label htmlFor="name" className="block mb-1 text-black">
                Evcil Hayvan Adı:
              </label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleChange}
                className="w-full border-gray-300 border rounded py-2 px-4 focus:outline-none focus:border-blue-500 bg-violet-200"
              />
            </div>
            <div>
              <label htmlFor="breed" className="block mb-1 text-black">
                Evcil Hayvan Cinsi:
              </label>
              <input
                type="text"
                name="breed"
                id="breed"
                onChange={handleChange}
                className="w-full border-gray-300 border rounded py-2 px-4 focus:outline-none focus:border-blue-500 bg-violet-200"
              />
            </div>
            <div>
              <label htmlFor="age" className="block mb-1 text-black">
                Evcil Hayvan Yaşı:
              </label>
              <input
                type="number"
                name="age"
                id="age"
                onChange={handleChange}
                className="w-full border-gray-300 border rounded py-2 px-4 focus:outline-none focus:border-blue-500 bg-violet-200"
              />
            </div>

            <div>
              <label htmlFor="type" className="block mb-1 text-black">
                Evcil Hayvan Türü:
              </label>
              <input
                type="text"
                name="type"
                id="type"
                onChange={handleChange}
                className="w-full border-gray-300 border rounded py-2 px-4 focus:outline-none focus:border-blue-500 bg-violet-200"
              />
            </div>
            <div>
              <label htmlFor="bio" className="block mb-1 text-black">
                Evcil Hayvan Hakkında:
              </label>
              <input
                type="text"
                name="bio"
                id="bio"
                onChange={handleChange}
                className="w-full border-gray-300 border rounded py-2 px-4 focus:outline-none focus:border-blue-500 bg-violet-200"
              />
            </div>

            <label htmlFor="pet_photo" className="block mb-1 text-black">
              Evcil Hayvan Fotoğrafı:
            </label>
            <div
          {...getRootProps()}
          className={`w-3/5 mx-auto flex flex-col justify-center items-center bg-pink-100 dark:bg-dark-dropzone border-4 border-dashed rounded-lg p-8 ${
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

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-rose-500 to-rose-600 text-white w-52 rounded-lg py-2 px-4 hover:opacity-75 mt-4"
              >
                Ekle
              </button>
            </div>

            {uploading && (
          <div className="flex items-center justify-center mb-4">
            <BeatLoader
              cssOverride={override}
              size={15}
              color={"pink"}
              loading={uploading}
            />
          </div>
        )}
          </form>
        </div>
      </div>
    </main>
  );
};

// Pet ekleme sayfasına sadece giriş yapmış kullanıcılar erişebilsin ve eğer kullanıcı zaten pet eklemişse tekrar pet ekleyemesin diye.
export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.token;
  const verifiedToken = await verifyJwtToken(token);

  if (!verifiedToken) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const userId = Number(verifiedToken.id);

  try {
    const pet = await prisma.pet.findUnique({
      where: {
        userId,
      },
    });

    if (pet) {
      return {
        redirect: {
          destination: "/myprofile",
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.error("Error retrieving pet:", error);
  }
  return {
    props: {},
  };
};

export default AddPet;
