"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [showUsernameError, setShowUsernameError] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showConfirmPasswordError, setShowConfirmPasswordError] =
    useState(false);
  const [showError, setShowError] = useState("");

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.termsAccepted) {
      alert("Lütfen hüküm ve koşulları kabul edin.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Girilen parolalar eşleşmiyor.", {
        draggable: false,
        autoClose: 3000,
      });
      return;
    }
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data.success === false) {
      toast.error(`Hata: ${data.errors}`, {
        draggable: false,
        autoClose: 3000,
      });
    } else if (data.success === false && data.errors["errorMessage"]) {
      // sistemde e-mail kayıtlıysa hatayı göstermek için
      const errorMessage =
        data.errors["errorMessage"] || "Bilinmeyen bir hata oluştu.";
      toast.error(`Hata: ${errorMessage}}`, {
        draggable: false,
        autoClose: 3000,
      });
    } else {
      toast.success("Üye kaydı başarılı! Yönlendiriliyorsunuz.", {
        draggable: false,
        autoClose: 2000,
      });
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.name) {
      case "username":
        setShowUsernameError(event.target.value.trim() === "");
        break;
      case "email":
        setShowEmailError(event.target.value.trim() === "");
        break;
      case "password":
        setShowPasswordError(event.target.value.trim() === "");
        break;
      case "confirmPassword":
        setShowConfirmPasswordError(event.target.value.trim() === "");
        break;
      default:
        break;
    }
  };

  const useCheckboxValidation = () => {
    const [showCheckboxError, setShowCheckboxError] = useState(false);

    const handleCheckboxChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setShowCheckboxError(!event.target.checked);
    };

    return { showCheckboxError, setShowCheckboxError, handleCheckboxChange };
  };

  const { showCheckboxError, handleCheckboxChange } = useCheckboxValidation();

  return (
    <main className="min-h-screen bg-gradient-to-br from-light-dropzone  to-pink-400 flex flex-col items-end justify-center px-4 sm:px-6 lg:px-8 selection:bg-rose-500 selection:text-white">
      <Image
        src="/logo/png/logo-no-background.png"
        width={125}
        height={125}
        alt="logo"
        className="flex self-start absolute top-0 left-0 mt-5 ml-5"
      />
      <div className="absolute py-3 sm:mx-auto z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-rose-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="backdrop-blur-sm bg-white/80 rounded-md p-8">
          <form onSubmit={handleSubmit}>
            <h2 className="text-4xl mb-12 flex justify-center text-purple-900">
              Kayıt Ol
            </h2>
            <div className={`relative ${showUsernameError ? "mb-2" : "mb-7"}`}>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={(e) => {
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    username: e.target.value,
                  }));
                }}
                onBlur={handleBlur}
                className="peer bg-white p-3 h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus-within:outline-none focus-within:border-rose-600"
                placeholder=""
                required
              />
              <label
                htmlFor="username"
                className={`absolute transition-all ${
                  formData.username.length === 0 && !formData.username
                    ? "left-2 top-2 text-gray-400 peer-focus-within:left-0 peer-focus-within:-top-6 peer-focus-within:text-gray-700 peer-focus-within:text-md peer-focus-within:text-bold"
                    : "left-0 -top-6 text-gray-900 text-md "
                }`}
              >
                Kullanıcı Adı
              </label>
            </div>
            {showUsernameError && (
              <div className="text-rose-500 mb-6">
                Kullanıcı adı boş bırakılamaz.
              </div>
            )}

            <div className={`relative ${showEmailError ? "mb-2" : "mb-7"}`}>
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
                className="peer p-3 bg-white h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus-within:outline-none focus-within:border-rose-600"
                placeholder=""
                required
              />
              <label
                htmlFor="email"
                className={`absolute transition-all ${
                  formData.email.length === 0 && !formData.email
                    ? "left-2 top-2 text-gray-400 peer-focus-within:left-0 peer-focus-within:-top-6 peer-focus-within:text-gray-700 peer-focus-within:text-md peer-focus-within:text-bold"
                    : "left-0 -top-6 text-gray-900 text-md "
                }`}
              >
                Email
              </label>
            </div>
            {showEmailError && (
              <div className="text-rose-500 mb-6">Email boş bırakılamaz.</div>
            )}

            <div className={`relative ${showPasswordError ? "mb-2" : "mb-7"}`}>
              <input
                type="password"
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
                className="peer bg-white p-3 h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus-within:outline-none focus-within:border-rose-600"
                placeholder=""
                required
              />
              <label
                htmlFor="password"
                className={`absolute transition-all ${
                  formData.password.length === 0 && !formData.password
                    ? "left-2 top-2 text-gray-400 peer-focus-within:left-0 peer-focus-within:-top-6 peer-focus-within:text-gray-700 peer-focus-within:text-md peer-focus-within:text-bold"
                    : "left-0 -top-6 text-gray-900 text-md "
                }`}
              >
                Parola
              </label>
            </div>
            {showPasswordError && (
              <div className="text-rose-500 mb-6">Parola boş bırakılamaz.</div>
            )}

            <div
              className={`relative ${
                showConfirmPasswordError ? "mb-2" : "mb-7"
              }`}
            >
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    confirmPassword: e.target.value,
                  }));
                }}
                onBlur={handleBlur}
                className="peer bg-white p-3 h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus-within:outline-none focus-within:border-rose-600"
                placeholder=""
                required
              />
              <label
                htmlFor="confirmPassword"
                className={`absolute transition-all ${
                  formData.confirmPassword.length === 0 &&
                  !formData.confirmPassword
                    ? "left-2 top-2 text-gray-400 peer-focus-within:left-0 peer-focus-within:-top-6 peer-focus-within:text-gray-700 peer-focus-within:text-md peer-focus-within:text-bold"
                    : "left-0 -top-6 text-gray-900 text-md "
                }`}
              >
                Parola
              </label>
            </div>
            {showConfirmPasswordError && (
              <div className="text-rose-500 mb-6">Parola boş bırakılamaz.</div>
            )}
            <div className="relative mb-7">
              <Link href="#">
                <label
                  htmlFor="termsAccepted"
                  className="block text-rose-700 font-bold mb-2 underline"
                >
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={(e) => {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        termsAccepted: e.target.checked,
                      }));

                      handleCheckboxChange(e);
                    }}
                    className="mr-2 leading-t accent-rose-500"
                  />
                  <span className="cursor-pointer">
                    Şartları okudum ve kabul ediyorum.
                  </span>
                </label>
              </Link>
              {showCheckboxError && (
                <div className="text-rose-500">
                  Şartları kabul etmeniz gerekmektedir.
                </div>
              )}
            </div>
            <div>
              <button
                type="submit"
                disabled={!formData.termsAccepted}
                className="w-full bg-gradient-to-r from-rose-700 to-purple-700 hover:from-rose-500 hover:to-purple-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Kayıt Ol
              </button>
            </div>
            <div className="p-2 flex flex-col items-center mt-4">
              <div className="text-sm  text-gray-500">Hesabınız var mı?</div>
              <Link href="/">
                <div className="text-rose-500 hover:text-purple-500 text-md duration-300 ease-in-out">
                  Giriş Yap
                </div>
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Image
        src="/logo/png/logo-without-layout-white.png"
        alt="Pate Logo"
        layout="fill"
        objectFit="contain"
        objectPosition="center"
        className="opacity-20"
      />
    </main>
  );
};

export default Register;
