import { type AppType } from "next/app";
import {
  ClerkProvider,

  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import Navbar from "~/components/homepage/Navbar";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import "@uploadthing/react/styles.css";
import HomePage from ".";
import { env } from "~/env.mjs";
import Head from "next/head";


const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} {...pageProps}>
      <Head>
        <title>Tractivity</title>
        <link rel="icon" href="/tractivitylogo.png" />
      </Head>
      <Toaster />
      <Navbar />
      <SignedIn>
        <Component {...pageProps} />
      </SignedIn>
      <SignedOut>
        <HomePage />
      </SignedOut>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
