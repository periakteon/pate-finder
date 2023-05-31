import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

type Pet = {
  name: string;
  breed: string;
  age: number;
  pet_photo: string;
  type: string;
  bio: string;
};

const AddPet = () => {
  const [pet, setPet] = useState<Pet>({
    name: "",
    breed: "",
    age: 0,
    pet_photo: "",
    type: "",
    bio: "",
  });

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPet({ ...pet, name: e.target.value });
  };

  const handleBreed = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPet({ ...pet, breed: e.target.value });
  };

  const handleAge = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPet({ ...pet, age: parseInt(e.target.value) });
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPet({ ...pet, pet_photo: e.target.value });
  };

  const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPet({ ...pet, type: e.target.value });
  };

  const handleBio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPet({ ...pet, bio: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Perform the submit logic here
    // You can access the pet object containing the entered values via the 'pet' state variable
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
          <h2 className="text-4xl font-bold mb-10 flex justify-center text-black">
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
                onChange={handleName}
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
                onChange={handleBreed}
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
                onChange={handleAge}
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
                onChange={handleType}
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
                onChange={handleBio}
                className="w-full border-gray-300 border rounded py-2 px-4 focus:outline-none focus:border-blue-500 bg-violet-200"
              />
            </div>

            <label htmlFor="pet_photo" className="block mb-1 text-black">
              Evcil Hayvan Fotoğrafı:
            </label>
            <div className="flex items-center justify-center">
              <button className="mr-2 ">
                <FontAwesomeIcon icon={faImage} className="w-36 h-36 text-violet-300 flex self-center hover: from:text-violet-500" />
              </button>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-green-800 text-white w-52 rounded py-2 px-4 hover:opacity-75 mt-4"
              >
                Evcil Hayvanı Ekle
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AddPet;
