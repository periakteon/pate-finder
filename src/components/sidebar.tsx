import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import defaultImage from "../../public/images/default.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faMagnifyingGlass,
  faPaw,
  faUser,
  faSun,
  faMoon,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import PostModal from "./postModal";
import { atom, useAtom } from "jotai";

export const isModalOpenAtom = atom(false);

type User = {
  id: number;
  username: string;
  profile_picture: string | null;
};

const Sidebar = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const { resolvedTheme, theme, setTheme } = useTheme();
  const [, setIsModalOpen] = useAtom(isModalOpenAtom);

  const handleSearchClick = () => {
    setSearchMode(true);
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 0);
  };

  const searchUsers = async (query: string) => {
    try {
      const response = await fetch(`/api/search?username=${query}`);
      const data = await response.json();

      if (data.success) {
        setTimeout(() => {
          setSearchResults(data.users);
        }, 200);
      }
    } catch (error) {
      console.log("Try Catch Error", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      setSearchResults([]);
    } else {
      searchUsers(event.target.value);
    }
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchInputRef.current && searchInputRef.current.value !== "") {
      const query = searchInputRef.current.value;
      searchUsers(query);
    } else {
      setSearchResults([]);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchInputRef.current &&
      event.target instanceof Node &&
      !searchInputRef.current.contains(event.target)
    ) {
      setSearchMode(false);
      setTimeout(() => {
        setSearchResults([]);
      }, 300);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsDarkTheme(resolvedTheme === "dark");
  }, [resolvedTheme]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="bg-violet-50 border-r-2 border-r-pink-200 flex flex-col rounded-md justify-between w-64 sticky top-0 dark:bg-dark-secondary dark:border-r-2 dark:border-r-dark-border h-screen">
      <div className="p-4 overflow-y-auto max-h-screen h-auto">
        <div className="text-3xl font-bold text-center mb-6 flex items-center justify-center">
          <Link href="/feed">
            <div className="flex-shrink-0 w-125 h-125 rounded-full overflow-hidden hover:opacity-80 transition-opacity">
              <Image
                priority={true}
                src={
                  isDarkTheme
                    ? "/logo/png/logo-no-background.png"
                    : "/logo/png/logo-no-background-pink.png"
                }
                width={125}
                height={125}
                alt="logo"
                style={{
                  width: "125px",
                  height: "125px",
                }}
              />
            </div>
          </Link>
        </div>

        <nav>
          <ul>
            <Link href="/feed">
              <motion.li
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-2"
              >
                <div className="flex items-center p-4 text-pink-600 hover:bg-pink-200 dark:hover:bg-dark-hover rounded-lg cursor-pointer transition-colors">
                  <FontAwesomeIcon
                    icon={faHouse}
                    className="text-2xl text-pink-600 mr-2 dark:text-white"
                  />
                  <span className="text-lg font-medium dark:text-white">
                    Anasayfa
                  </span>
                </div>
              </motion.li>
            </Link>
            <motion.li
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-2"
            >
              {!searchMode ? (
                <div
                  className="flex items-center p-4 text-pink-600 hover:bg-pink-200 dark:hover:bg-dark-hover rounded-lg cursor-pointer transition-colors"
                  onClick={handleSearchClick}
                >
                  <label htmlFor="searchInput">
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className="text-2xl text-pink-600 mr-2 dark:text-white"
                    />
                  </label>
                  <span className="text-lg font-medium dark:text-white">
                    Ara
                  </span>
                </div>
              ) : (
                <form
                  onChange={handleSearchSubmit}
                  className="flex items-center"
                >
                  <label htmlFor="searchInput" className="relative">
                    <input
                      ref={searchInputRef}
                      onChange={handleInputChange}
                      type="text"
                      id="searchInput"
                      placeholder="Ara..."
                      className="w-full p-3 pr-10 rounded-lg border-2 border-pink-600 dark:border-white dark:bg-dark-searchBar  dark:text-white transition-all"
                    />
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className="absolute right-3 top-4 text-pink-600 dark:text-white"
                    />
                  </label>
                </form>
              )}
              {/** arama sonuçları */}
              <div>
                {searchResults.length > 0 && (
                  <div className="max-h-60 overflow-y-auto border-b bg-slate-600 border-gray-300">
                    {searchResults.map((user) => (
                      <Link href={`/profile/${user.username}`} key={user.id}>
                        <div className="p-2 flex flex-row hover:bg-slate-500">
                          <Image
                            priority
                            src={defaultImage}
                            className="rounded-full"
                            width={32}
                            height={32}
                            alt="Avatar"
                          />
                          <span className="ml-3 p-1">{user.username}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {searchResults.length === 0 &&
                  searchMode &&
                  searchInputRef.current &&
                  searchInputRef.current.value !== "" && (
                    <div className="text-gray-500 py-2">
                      Böyle bir kullanıcı yok
                    </div>
                  )}
              </div>
              {/** arama sonuçları */}
            </motion.li>
            <Link href="/explore">
              <motion.li
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-2"
              >
                <div className="flex items-center p-4 text-pink-600 hover:bg-pink-200 dark:hover:bg-dark-hover rounded-lg cursor-pointer transition-colors">
                  <FontAwesomeIcon
                    icon={faPaw}
                    className="text-2xl text-pink-600 mr-2 dark:text-white"
                  />
                  <span className="text-lg font-medium dark:text-white">
                    Keşfet
                  </span>
                </div>
              </motion.li>
            </Link>
            <Link href="/myprofile">
              <motion.li
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-2"
              >
                <div className="flex items-center p-4 text-pink-600 hover:bg-pink-200 dark:hover:bg-dark-hover rounded-lg cursor-pointer transition-colors">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-2xl text-pink-600 mr-2 dark:text-white"
                  />
                  <span className="text-lg font-medium dark:text-white">
                    Profil
                  </span>
                </div>
              </motion.li>
            </Link>
            <motion.li
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-2"
            >
              <div
                onClick={() => setIsModalOpen(true)}
                className="flex items-center p-4 text-pink-600 hover:bg-pink-200 dark:hover:bg-dark-hover rounded-lg cursor-pointer transition-colors"
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-2xl text-pink-600 mr-2 dark:text-white"
                />
                <button className="text-lg font-medium dark:text-white">
                  Gönderi Ekle
                </button>
              </div>
            </motion.li>
          </ul>
        </nav>
      </div>
      <div className="flex mx-auto bottom-0 fixed">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center p-4 text-pink-600 dark:text-white rounded-lg"
        >
          <button className="transition-all cursor-pointer">
            {resolvedTheme === "dark" ? (
              <FontAwesomeIcon
                icon={faSun}
                className={`icon-style mr-2 ${
                  theme === "light" ? "rotate-0" : "rotate-90"
                } transition-transform animate-spin-slow`}
                onClick={() => setTheme("light")}
              />
            ) : (
              <FontAwesomeIcon
                icon={faMoon}
                className={`icon-style mr-2 ${
                  theme === "dark" ? "rotate-0" : "rotate-0"
                } transition-transform animate-spin-slow`}
                onClick={() => setTheme("dark")}
              />
            )}
          </button>
          <span className="text-lg font-medium">{`${
            resolvedTheme === "dark" ? "Aydınlık Mod" : "Karanlık Mod"
          }`}</span>
        </motion.div>
      </div>
      <PostModal />
    </div>
  );
};

export default Sidebar;
