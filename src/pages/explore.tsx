import Sidebar from "@/components/sidebar";
import Image from "next/image";
import defaultImage from "../../public/images/default.jpeg";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { exploreResponse } from "@/utils/zodSchemas";
import { toast } from "react-toastify";

type UserData = {
  id: number;
  username: string;
  profile_picture: string | null;
  createdAt: string;
  pet: {
    type: string;
    id: number;
    name: string;
    breed: string;
    pet_photo: string | null;
  } | null;
};

const IndexPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<UserData[]>([]);

  const formatCreatedAt = (createdAt: string) => {
    const date = new Date(createdAt);
    return date.toLocaleDateString();
  };

  const fetchData = async () => {
    try {
      const response = await fetch("/api/explore");
      if (!response.ok) {
        throw new Error("Failed to fetch data from API");
      }
      const data = await response.json();
      const parsed = await exploreResponse.safeParseAsync(data);

      if (!parsed.success) {
        console.log("parsed error:", parsed.error);
        toast.error(`Hata: ${parsed.error}`, {
          draggable: false,
          autoClose: 2000,
        });
        return;
      }

      if (!parsed.data.success) {
        toast.error(`Hata: ${parsed.data.errors}`, {
          draggable: false,
          autoClose: 2000,
        });
        return;
      }
      if (parsed.data.success) {
        return setData(parsed.data.users);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row text-black">
      <div className="md:w-64">
        <Sidebar />
      </div>
      <div className="w-full min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl text-center font-bold mb-4 dark:text-white">
            Kullanıcıları Keşfet
          </h1>
          <div className="space-y-4">
            {data.map((user) => (
              <div
                key={user.id}
                className="dark:bg-dark-secondary dark:border dark:border-gray-500 dark:text-white p-4 rounded shadow"
              >
                <div className="flex flex-col md:flex-row items-center space-x-4">
                  {user.profile_picture ? (
                    <Image
                      src={user.profile_picture}
                      alt="Profile Picture"
                      className="w-16 h-16 md:w-32 md:h-32 rounded-full"
                      width={64}
                      height={64}
                    />
                  ) : (
                    <Image
                      src={defaultImage}
                      alt="Profile Picture"
                      className="w-16 h-16 md:w-32 md:h-32 rounded-full"
                      width={64}
                      height={64}
                    />
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">{user.username}</h2>
                    <p>Created At: {formatCreatedAt(user.createdAt)}</p>
                  </div>
                </div>
                <p className="mt-2">
                  {user.pet ? `Pet: ${user.pet}` : "No pet"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
