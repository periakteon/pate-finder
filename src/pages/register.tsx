import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Register = () => {
  //TODO: Make register operation. use /api/register

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
    <div className="min-h-screen bg-gradient-to-br from-red-400 to-purple-600 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 selection:bg-rose-500 selection:text-white">
      <Image
        src="/logo/png/logo-no-background.png"
        width={125}
        height={125}
        alt="logo"
        className="flex self-start absolute top-0 left-0 mt-5 ml-5"
      />
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-rose-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="backdrop-blur-sm bg-white/80 rounded-md p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log(formData);
            }}
          >
            <h2 className="text-4xl font-bold mb-10 flex justify-center">
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
                className="peer p-3 h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus-within:outline-none focus-within:border-rose-600"
                placeholder=""
                required
              />
              <label
                htmlFor="username"
                className={`absolute transition-all ${formData.username.length === 0 && !formData.username
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
                className="peer p-3 h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus-within:outline-none focus-within:border-rose-600"
                placeholder=""
                required
              />
              <label
                htmlFor="email"
                className={`absolute transition-all ${formData.email.length === 0 && !formData.email
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
                className="peer p-3 h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus-within:outline-none focus-within:border-rose-600"
                placeholder=""
                required
              />
              <label
                htmlFor="password"
                className={`absolute transition-all ${formData.password.length === 0 && !formData.password
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
              className={`relative ${showConfirmPasswordError ? "mb-2" : "mb-7"
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
                className="peer p-3 h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus-within:outline-none focus-within:border-rose-600"
                placeholder=""
                required
              />
              <label
                htmlFor="confirmPassword"
                className={`absolute transition-all ${formData.confirmPassword.length === 0 &&
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

            <div className="relative h-24">
              {/* TODO: Use modal for terms and conditions, and width expansion on unclick, and disable button */}
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
                  Üye olmak için şartları kabul etmelisiniz.
                </div>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-700 to-purple-700 hover:from-rose-500 hover:to-purple-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Kayıt Ol
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
