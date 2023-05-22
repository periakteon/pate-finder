import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
import { atom, useAtom } from 'jotai';

export const isModalOpenAtom = atom(false);

const Sidebar = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const { resolvedTheme, theme, setTheme } = useTheme();
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const [, setIsModalOpen] = useAtom(isModalOpenAtom);

  const handleSearchClick = () => {
    setSearchMode(true);
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 0);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Arama API'si yaz
    console.log("Search submitted");
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchInputRef.current &&
      event.target instanceof Node &&
      !searchInputRef.current.contains(event.target)
    ) {
      setSearchMode(false);
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
    <div className="bg-violet-50 border-r-2 border-r-pink-200 flex flex-col rounded-md justify-between w-64 h-screen sticky top-0 dark:bg-dark-secondary dark:border-r-2 dark:border-r-dark-border">
      <div className="p-4 overflow-y-auto max-h-screen">
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
                  onSubmit={handleSearchSubmit}
                  className="flex items-center"
                >
                  <label htmlFor="searchInput" className="relative">
                    <input
                      ref={searchInputRef}
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
            </motion.li>
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
      <div className="p-4 mx-auto">
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
        </motion.div>
      </div>
      <PostModal/>
    </div>
  );
};

export default Sidebar;
