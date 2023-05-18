import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faMagnifyingGlass,
  faPaw,
  faUser,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Sidebar = () => {
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

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
    <div className="bg-violet-50 flex flex-col justify-between w-64 h-screen sticky top-0">
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
                      className="w-full p-2 pr-10 rounded-lg border-2 border-pink-600"
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
      <div className="p-4">
        <div className="flex items-center p-4 text-pink-600 hover:bg-pink-200 rounded-lg cursor-pointer">
          <FontAwesomeIcon
            icon={faBars}
            className="text-2xl text-pink-600 mr-2"
          />
          <span className="text-lg font-medium">Ayarlar</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
