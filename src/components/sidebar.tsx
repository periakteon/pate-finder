import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faMagnifyingGlass,
  faPaw,
  faUser,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  return (
    <div className="bg-violet-50 flex flex-col justify-between w-64 h-screen sticky top-0">
      <div className="p-4">
        <div className="text-3xl font-bold text-center mb-6">
          <Image
            src="/logo/png/logo-no-background-pink.png"
            width={125}
            height={125}
            alt="logo"
            className="flex self-start top-0 left-0 mt-5 ml-5"
          />
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
              <div className="flex items-center p-4 text-pink-600 hover:bg-pink-200 rounded-lg cursor-pointer">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="text-2xl text-pink-600 mr-2"
                />
                <span className="text-lg font-medium">Ara</span>
              </div>
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
