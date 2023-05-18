import "@/styles/globals.css";
import { Roboto } from "next/font/google";
import { Poppins } from "next/font/google";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastContainer />
      <main className={poppins.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
