import "@/styles/globals.css";
import { Poppins } from "next/font/google";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState("");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setTheme(storedTheme || "dark"); // eğer localStorage'da bir tema yoksa default olarak "dark" yapıyoruz
  }, []);

  return (
    <>
      <ThemeProvider attribute="class">
        <ToastContainer theme={`${theme === "dark" ? "dark" : "light"}`} />
        <main
          className={`${poppins.className} bg-light-primary dark:bg-dark-background min-w-fit h-fit`}
        >
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
    </>
  );
}
