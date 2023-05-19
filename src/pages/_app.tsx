import "@/styles/globals.css";
import { Roboto } from "next/font/google";
import { Poppins } from "next/font/google";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "next-themes";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider attribute="class">
        <ToastContainer />
        <main
          className={`${poppins.className} bg-gray-100 dark:bg-dark-background`}
        >
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
    </>
  );
}
