import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookSquare,
  faGoogle,
  faSquareTwitter,
} from "@fortawesome/free-brands-svg-icons";

const Login = () => {
  //TODO: Make register operation. use /api/register

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    termsAccepted: false,
  });

  const [showEmailError, setShowEmailError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.name) {
      case "email":
        setShowEmailError(event.target.value.trim() === "");
        break;
      case "password":
        setShowPasswordError(event.target.value.trim() === "");
        break;
      default:
        break;
    }
  };
  return (
    <div className=" min-h-screen bg-gradient-to-br from-cyan-400 to-purple-400 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 selection:bg-rose-500 selection:text-white">
      <Image
        src="/logo/png/logo-no-background.png"
        width={125}
        height={125}
        alt="logo"
        className="absolute flex self-start top-0 left-0 mt-5 ml-5"
      />
      <div className="absolute py-3 sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 shadow-lg transform  sm:-rotate-3 sm:rounded-xl"></div>
        <div className=" backdrop-blur-sm w-80 hover:max-h-screen bg-white/80 rounded-md p-8 m-1">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log(formData);
            }}
          >
            <h2 className="text-4xl mb-12 flex justify-center text-purple-900">
              Giriş Yap
            </h2>
            <div className="relative mb-7 h-16">
              <label
                htmlFor="email"
                className="block mb-1 font-bold text-gray-600"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    email: e.target.value,
                  }));
                }}
                onBlur={handleBlur}
                className={`peer p-3 h-10 w-full text-sm border-b-2 ${showEmailError ? "border-red-500" : "border-gray-300"
                  } text-gray-600 bg-white focus-within:outline-none focus-within:border-rose-600`}
                placeholder="example@mail.com"
                required
              />
              {showEmailError && (
                <div className="text-red-500 text-xs">Email boş bırakılamaz.</div>
              )}
            </div>

            <div className="relative mb-7 h-16">
              <label
                htmlFor="password"
                className="block mb-1 font-bold text-gray-600"
              >
                Parola
              </label>
              <input
                id="password"
                name="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    password: e.target.value,
                  }));
                }}
                onBlur={handleBlur}
                className={`peer p-3 h-10 text-sm w-full border-b-2 ${showPasswordError ? "border-red-500" : "border-gray-300"
                  } text-gray-600  focus-within:outline-none focus-within:border-rose-600`}
                placeholder="*********"
                required
              />

              {showPasswordError && (
                <div className="text-red-500 text-xs">Parola boş bırakılamaz.</div>
              )}
            </div>


            <div className="p-8" />
            <div className="flex items-center justify-around pb-2">
              <button className="h-12 w-12">
                <FontAwesomeIcon
                  icon={faFacebookSquare}
                  className="w-8 h-8"
                  color="#3B5998"
                />
              </button>
              <button className="h-12 w-12">
                <FontAwesomeIcon
                  icon={faSquareTwitter}
                  className="w-8 h-8"
                  color="#1DA1F2"
                />
              </button>
              <button className="h-12 w-12">
                <FontAwesomeIcon
                  icon={faGoogle}
                  className="w-7 h-7"
                  color="#DB4437"
                />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-700 to-purple-700 hover:from-rose-500 hover:to-purple-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
              >
                Giris Yap
              </button>
              <div className="p-1" />
              <div className="text-sm  text-gray-500">Hesabiniz yok mu?</div>
              <Link href="/register">
                <div className="text-rose-500 hover:text-purple-500 text-md duration-300 ease-in-out -mt-4">
                  Kayit ol
                </div>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
