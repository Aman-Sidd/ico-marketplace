import Head from "next/head";
import toast,{Toaster} from "react-hot-toast";
import "../styles/globals.css";

import {StateContextProvider} from "../Context/index";

export default function App({ Component, pageProps }) {
  return (
    <StateContextProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
      <Toaster/>
    </StateContextProvider>
  );
}
