import "@/styles/globals.css";
import { Poppins } from "next/font/google";
import type { AppProps } from "next/app";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState(""); // theme değerini depolayacağımız state

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setTheme(storedTheme || "dark");
  }, []);

  return (
    <>
      <ThemeProvider attribute="class">
        <ToastContainer theme={`${theme === "dark" ? "dark" : "light"}`} />
        <main
          className={`${poppins.className} bg-gray-100 dark:bg-dark-background`}
        >
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
    </>
  );
}
