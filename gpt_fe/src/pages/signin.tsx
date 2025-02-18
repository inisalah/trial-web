import clsx from "clsx";
import type { GetServerSidePropsContext } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth/next";
import type { BuiltInProviderType } from "next-auth/providers";
import type { ClientSafeProvider } from "next-auth/react";
import { getProviders, signIn, useSession } from "next-auth/react";
import type { LiteralUnion } from "next-auth/react/types";
import React, { useState } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import FadeIn from "../components/motions/FadeIn";
import GridLayout from "../layout/grid";
import { authOptions } from "../server/auth/auth";
import Input from "../ui/input";

// The SignIn component that renders the sign-in page with provider buttons
const SignIn = ({ providers }: { providers: Provider }) => {
  const { data: session } = useSession();
  const { push } = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (session) push("/").catch(console.error);

  const details = Object.values(providerButtonDetails)
    .map((provider) => providerButtonDetails[provider.id])
    .filter((detail): detail is ButtonDetail => detail !== undefined);

  return (
    <GridLayout title="Sign in - Reworkd">
      <div className="grid h-screen w-screen place-items-center bg-gradient-radial from-slate-1 via-20% to-transparent">
        <div className="flex h-full w-full max-w-screen-lg flex-col items-center justify-center gap-10">
          <FadeIn
            duration={1.5}
            initialY={-50}
            className="flex flex-col items-center justify-center gap-6 text-white invert"
          >
            <div className="flex flex-col items-center justify-center gap-16">
              <Image
                src="/logos/dark-default-gradient.svg"
                width="150"
                height="150"
                alt="Reworkd AI"
              />
              <h1 className="bg-gradient-to-t from-white via-neutral-300 to-neutral-500 bg-clip-text text-center text-3xl font-bold leading-[1.1em] tracking-[-0.64px] text-transparent md:text-5xl">
                Reworkd
              </h1>
            </div>
          </FadeIn>
          <FadeIn duration={1.5} delay={0.4} initialY={50}>
            {providers.credentials && <InsecureSignin />}
            {details.map((detail) => (
              <ProviderSignInButton
                key={detail.id}
                detail={detail}
                setIsModalOpen={setIsModalOpen} // Pass the function to manage modal state
              />
            ))}
          </FadeIn>
        </div>
      </div>

      {/* Tailwind Modal for MetaMask Not Installed */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)} // Close the modal when clicking outside
        >
          <div
            className="bg-gradient-to-t from-gray-800 to-gray-900 p-8 rounded-xl shadow-2xl w-96"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicked inside
          >
            <div className="text-center text-white">
              <h2 className="text-2xl font-semibold mb-4">MetaMask Not Installed</h2>
              <p className="mb-6 text-gray-300">
                It looks like you do not have MetaMask installed. Please install the MetaMask extension to continue.
              </p>
              <a
                href="https://metamask.io/download.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 w-11/12 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
              >
                Download MetaMask
              </a>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 w-11/12 text-white px-6 py-2 rounded-lg font-semibold transition duration-300 hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>

      )}
    </GridLayout>
  );
};


const InsecureSignin = () => {
  const [usernameValue, setUsernameValue] = useState("");

  return (
    <div className="flex flex-col">
      <Input
        value={usernameValue}
        onChange={(e) => setUsernameValue(e.target.value)}
        placeholder="Enter Username"
        type="text"
        name="Username Field"
      />
      <button
        onClick={() => {
          if (!usernameValue) return;

          signIn("credentials", {
            callbackUrl: "/",
            name: usernameValue,
          }).catch(console.error);
        }}
        className={clsx(
          "mb-4 mt-4 flex items-center rounded-md bg-slate-12 px-10 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-slate-10 sm:text-base",
          !usernameValue && "cursor-not-allowed"
        )}
      >
        Sign in with username (Insecure)
      </button>
    </div>
  );
};


// MetaMask connection and disconnection logic
const ProviderSignInButton = ({ detail, setIsModalOpen }: { detail: ButtonDetail, setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {

  const connect = async () => {
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

          if (accounts.length > 0) {
            signIn("credentials", {
              callbackUrl: "/",
              name: accounts[0], // First account address
            }).catch(console.error);
          }
        } catch (err) {
          console.error("Error connecting to MetaMask", err);
          alert("Error connecting to MetaMask.");
        }
      } else if (isMobile) {
        // Open MetaMask mobile app
        window.location.href = "https://metamask.app.link/dapp/http://192.168.0.145:3000/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000";
      } else {
        setIsModalOpen(true); // Show modal if MetaMask is not installed
      }
    } catch (err) {
      console.warn("No accounts found", err);
    }
  };



  return (
    <button
      onClick={() => {
        switch (detail.id) {
          case "metamask":
            connect(); // Trigger MetaMask connection if it's selected
            break;
          case "discord":
            signIn(detail.id, { callbackUrl: "/" }).catch(console.error);
            break;
          case "github":
            signIn(detail.id, { callbackUrl: "/" }).catch(console.error);
            break;
        }
      }}
      className={clsx(
        detail.color,
        "mb-4 flex w-full items-center rounded-md px-10 py-3 text-base font-semibold shadow-md transition-colors duration-300 sm:px-16 sm:py-5 sm:text-xl"
      )}
    >
      {detail.icon}
      Sign in with {detail.id}
    </button>
  );
};

type Provider = Record<LiteralUnion<BuiltInProviderType>, ClientSafeProvider>;

interface ButtonDetail {
  id: string;
  icon: JSX.Element;
  color: string;
}

const providerButtonDetails: { [key: string]: ButtonDetail } = {
  metamask: {
    id: "metamask",
    icon: <Image className="mr-3" src="/metamask.svg" width={30} height={30} alt="MetaMask" />,
    color: "bg-white hover:bg-gray-200 text-black",
  },
  discord: {
    id: "discord",
    icon: <FaDiscord className="mr-2" />,
    color: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  github: {
    id: "github",
    icon: <FaGithub className="mr-2" />,
    color: "bg-gray-800 hover:bg-gray-900 text-white",
  },
};

export default SignIn;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  return {
    props: { providers: (await getProviders()) ?? {} },
  };
}
