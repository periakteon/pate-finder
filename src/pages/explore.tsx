import Sidebar from "@/components/Sidebar/sidebar";
import Image from "next/image";
import defaultImage from "../../public/images/default.jpeg";
import React, { useEffect, useState } from "react";
import { exploreResponse } from "@/utils/zodSchemas";
import { toast } from "react-toastify";
import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
} from "@material-tailwind/react";

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
  const [data, setData] = useState<UserData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // NICE TO HAVE: use date-fns
  const formatCreatedAt = (createdAt: string | null) => {
    if (!createdAt) {
      return "";
    }

    const date = new Date(createdAt);

    return date.toLocaleDateString();
  };

  const fetchData = async (page: number) => {
    try {
      const response = await fetch(`/api/explore?page=${page}`);

      if (!response.ok) {
        throw new Error("Failed to fetch data from API");
      }

      const data = await response.json();
      const parsed = await exploreResponse.safeParseAsync(data);

      if (!parsed.success) {
        throw new Error(parsed.error.toString());
      }

      if (!parsed.data.success) {
        throw new Error(parsed.data.errors.toString());
      }

      if (parsed.data.success) {
        const newUsers = parsed.data.users as UserData[];
        setData((prevData) => [...prevData, ...newUsers]);
      }
    } catch (error) {
      toast.error(`Hata: ${error}`, {
        draggable: false,
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;

      if (windowHeight + scrollTop >= documentHeight) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex md:flex-row text-black">
      <div className="bg-white dark:bg-dark-secondary fixed z-50">
        <Sidebar />
      </div>
      <div className="w-full min-h-screen p-8">
        <div className="max-w-2xl mx-auto ps-5">
          <h1 className="text-4xl text-center font-bold mb-4 dark:text-white py-10">
            Kullanıcıları Keşfet
          </h1>
          <div className="space-y-4">
            <Card className="dark:bg-dark-secondary dark:border dark:border-gray-500 dark:text-white m-4 rounded shadow">
              {data.map((user, id) => (
                <div
                  key={id}
                  className="dark:bg-dark-secondary dark:border dark:border-gray-500 dark:hover:border-gray-400 dark:text-white m-4 rounded shadow"
                >
                  <List>
                    <a href={`/profile/${user.username}`}>
                      <ListItem>
                        <ListItemPrefix>
                          <div className="flex flex-col md:flex-row items-center space-x-4">
                            <Image
                              src={user.profile_picture || defaultImage}
                              alt="Profile Picture"
                              className="w-16 h-16 md:w-32 md:h-32 rounded-full"
                              width={64}
                              height={64}
                            />
                          </div>
                        </ListItemPrefix>
                        <div>
                          <Typography variant="h6" color="blue-gray">
                            <div>
                              <h2 className="text-2xl font-bold">
                                {user.username}
                              </h2>
                              <p>
                                Kayıt Tarihi: {formatCreatedAt(user.createdAt)}
                              </p>
                            </div>
                          </Typography>
                          <Typography
                            variant="small"
                            color="gray"
                            className="font-normal"
                          >
                            <span className="mt-2">
                              {user.pet ? (
                                <span className="font-bold text-2xl text-black dark:text-white">
                                  Pet:
                                </span>
                              ) : (
                                <span className="text-rose-600 font-bold">
                                  Pet bulunamadı
                                </span>
                              )}
                              <span className="font-bold text-2xl text-slate-300">
                                {user.pet && ` ${user.pet.name}`}
                              </span>
                            </span>
                          </Typography>
                        </div>
                      </ListItem>
                    </a>
                  </List>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
