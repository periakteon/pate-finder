import { useState } from "react";
import Link from "next/link";

type RegisterProps = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
};

const RegisterForm = (props: RegisterProps) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formData);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 to-purple-600 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 selection:bg-rose-500 selection:text-white">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div
          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-rose-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
        </div>
        <div className="backdrop-blur-sm bg-white/80 rounded-md p-8">
          <form onSubmit={handleSubmit}>
            <h2 className="text-4xl font-bold mb-10 flex justify-center">Kayıt Ol</h2>


            <div className="relative mb-4">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus-within:outline-none focus-within:border-rose-600"
                placeholder=""
                required
              />
              <label
                htmlFor="username"
                className={`absolute left-1 top-2 transition-all text-gray-400 ${formData.username.length > 0 ? 'text-md' : 'text-base'
                  } ${formData.username.length > 0 ? 'text-gray-400' : ''
                  } peer-focus-within:left-0 peer-focus-within:-top-6 peer-focus-within:text-gray-700 peer-focus-within:text-md peer-focus-within:text-bold`}
              >
                Kullanıcı Adı
              </label>
            </div>





            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2 after:content-['*'] after:ml-0.5 after:text-red-500">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border-b-2 border-gray-300 focus:border-rose-600 shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-bold mb-2 after:content-['*'] after:ml-0.5 after:text-red-500">
                Parola
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border-b-2 border-gray-300 focus:border-rose-600 shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2 after:content-['*'] after:ml-0.5 after:text-red-500">
                Parolayı Onayla
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="border-b-2 border-gray-300 focus:border-rose-600 shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <Link href="#">
                <label htmlFor="termsAccepted" className="block text-rose-700 font-bold mb-2 underline">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="mr-2 leading-t accent-rose-500"
                  />
                  <span className="cursor-pointer">Şartları okudum ve kabul ediyorum.</span>
                </label>
              </Link>
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

export default RegisterForm;

