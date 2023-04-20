import "@/styles/globals.css";
import { Roboto } from 'next/font/google'
import {Poppins} from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
})


import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={poppins.className}>
      <Component {...pageProps} />
    </main>
  );
}
