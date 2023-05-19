import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faMagnifyingGlass,
  faPaw,
  faUser,
  faBars,
  faSun,
  faMoon
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useTheme } from 'next-themes';

const Sidebar = () => {
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const { resolvedTheme, theme, setTheme } = useTheme();

  const handleSearchClick = () => {
    setSearchMode(true);
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

  return (
    <div className="bg-violet-50 flex flex-col justify-between w-64 h-screen sticky top-0 border-2 border-r-pink-200 dark:bg-dark-primary dark:border-2 dark:border-r-violet-500">
      <div className="p-4 overflow-y-auto max-h-screen-80">
        <div className="text-3xl font-bold text-center mb-6 flex items-center justify-center">
          <Link href="/feed">
            <div className="flex-shrink-0 w-125 h-125 rounded-full overflow-hidden hover:opacity-80">
              <Image
                src="/logo/png/logo-no-background-pink.png"
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
            <li className="mb-2">
              <div className="flex items-center p-4 text-pink-600 hover:bg-pink-200 rounded-lg cursor-pointer">
                <FontAwesomeIcon
                  icon={faHouse}
                  className="text-2xl text-pink-600 mr-2"
                />
                <span className="text-lg font-medium">Anasayfa</span>
              </div>
            </li>
            <li className="mb-2">
              {!searchMode ? (
                <div
                  className="flex items-center p-4 text-pink-600 hover:bg-pink-200 rounded-lg cursor-pointer"
                  onClick={handleSearchClick}
                >
                  <label htmlFor="searchInput">
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className="text-2xl text-pink-600 mr-2"
                    />
                  </label>
                  <span className="text-lg font-medium">Ara</span>
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
                      className="w-full p-2 pr-10 rounded-lg border-2 border-pink-600 dark:bg-pink-200 dark:text-black"
                    />
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className="absolute right-3 top-3 text-pink-600"
                    />
                  </label>
                </form>
              )}
            </li>
            <li className="mb-2">
              <div className="flex items-center p-4 text-pink-600 hover:bg-pink-200 rounded-lg cursor-pointer">
                <FontAwesomeIcon
                  icon={faPaw}
                  className="text-2xl text-pink-600 mr-2"
                />
                <span className="text-lg font-medium">Keşfet</span>
              </div>
            </li>
            <li className="mb-2">
              <div className="flex items-center p-4 text-pink-600 hover:bg-pink-200 rounded-lg cursor-pointer">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-2xl text-pink-600 mr-2"
                />
                <span className="text-lg font-medium">Profil</span>
              </div>
            </li>
          </ul>
        </nav>
      </div>
      <div className="p-4 mx-auto">
  <div className="flex items-center p-4 text-pink-600 rounded-lg">
    <button className="transition-all cursor-pointer">
      {resolvedTheme === "dark" ? (
        <FontAwesomeIcon
          icon={faSun}
          className={`icon-style mr-2 ${theme === "light" ? "rotate-0" : "rotate-90"} transition-transform animate-spin-slow`}
          onClick={() => setTheme("light")}
          style={{ fontSize: "3rem" }} // İstediğiniz boyutu burada belirleyin
        />
      ) : (
        <FontAwesomeIcon
          icon={faMoon}
          className={`icon-style mr-2 ${theme === "dark" ? "rotate-0" : "rotate-0"} transition-transform animate-spin-slow`}
          onClick={() => setTheme("dark")}
          style={{ fontSize: "3rem" }} // İstediğiniz boyutu burada belirleyin
        />
      )}
    </button>
  </div>
</div>

    </div>
  );
};

export default Sidebar;