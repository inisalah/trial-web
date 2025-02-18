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
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa";
import { useSDK, MetaMaskProvider } from "@metamask/sdk-react";
import FadeIn from "./src/components/motions/FadeIn";
import GridLayout from "./src/layout/grid";
import { authOptions } from "./src/server/auth/auth";
import Input from "./src/ui/input";
import { method } from "lodash";

const SignIn = ({ providers }: { providers: Provider }) => {
    const { data: session } = useSession();
    const { push } = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (session) push("/").catch(console.error);

    const details = Object.values(providerButtonDetails)
        .map((provider) => providerButtonDetails[provider.id])
        .filter((detail): detail is ButtonDetail => detail !== undefined);

    // console.log(`Details from provider ${JSON.stringify(details, null, 2)}`);


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
                        {/* {providers.credentials && <InsecureSignin />} */}
                        {details.map((detail) => (
                            <ProviderSignInButton key={detail.id} detail={detail} />
                        ))}
                    </FadeIn>
                </div>
            </div>
            {/* Tailwind Modal for MetaMask Not Installed */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50"
                    onClick={() => setIsModalOpen(false)} // Close the modal when clicking outside
                >
                    <div
                        className="bg-white p-8 rounded-lg shadow-lg w-80"
                        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicked inside
                    >
                        <h2 className="text-xl font-bold mb-4">MetaMask Not Installed</h2>
                        <p className="mb-4">
                            It looks like you do not have MetaMask installed. Please install
                            the MetaMask extension to continue.
                        </p>
                        <a
                            href="https://metamask.io/download.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            Download MetaMask
                        </a>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
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

type Provider = Record<LiteralUnion<BuiltInProviderType>, ClientSafeProvider>;

interface ButtonDetail {
    id: string;
    icon: JSX.Element;
    color: string;
}

const providerButtonDetails: { [key: string]: ButtonDetail } = {
    metamask: {
        id: "metamask",
        icon: <Image className="mr-3" src="/metamask.svg" width={30} height={30} alt={""} />,
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

const ProviderSignInButton = ({ detail }: { detail: ButtonDetail }) => {
    const { sdk, connected, connecting, account } = useSDK();


    // Metamask Connect Function
    const connect = async () => {
        try {
            // Check if MetaMask extension exists
            if (window.ethereum) {

                try {
                    const account = await window.ethereum.request({ method: "eth_requestAccount" })
                    alert(`MetaMask is Installed ${JSON.stringify(account, null, 2)}`);
                } catch {
                    alert(`Error connecting ..... `);
                }
            } else {
                //setIsModalOpen(true);
            }

            // Attempt to connect (assuming `sdk?.connect()` is the correct method)
            await sdk?.connect();
        } catch (err) {
            console.warn("No accounts found", err);
        }
    };

    const disconnect = () => {
        if (sdk) {
            sdk.terminate();
        }
    };
    return (
        <button
            onClick={() => {
                switch (detail.id) {

                    case "metamask":
                        connected ?
                            signIn(detail.id, { callbackUrl: "http://localhost:300/" }).catch(console.error) :
                            connect();
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







// import clsx from "clsx";
// import type { ChangeEvent, KeyboardEvent, ReactNode, RefObject } from "react";

// import Label from "./Label";
// import type { toolTipProperties } from "../types";

// type InputElement = HTMLInputElement | HTMLTextAreaElement;

// interface InputProps {
//     small?: boolean;
//     left?: ReactNode;
//     value: string | number | undefined;
//     onChange: (e: ChangeEvent<InputElement>) => void;
//     placeholder?: string;
//     disabled?: boolean;
//     type?: string;
//     subType?: string;
//     attributes?: { [key: string]: string | number | string[] };
//     toolTipProperties?: toolTipProperties;
//     inputRef?: RefObject<InputElement>;
//     onKeyDown?: (e: KeyboardEvent<InputElement>) => void;
// }

// const Input = (props: InputProps) => {
//     const isTypeTextArea = () => props.type === "textarea";

//     return (
//         <div className="relative w-full">
//             {props.left && (
//                 <Label left={props.left} type={props.type} toolTipProperties={props.toolTipProperties} />
//             )}
//             {isTypeTextArea() ? (
//                 <textarea
//                     className={clsx(
//                         "w-full h-20 resize-none rounded-md border border-transparent bg-opacity-10 backdrop-blur-md p-3 text-sm md:text-lg transition-all duration-300",
//                         "bg-gradient-to-r from-[#1A7F64] via-[#1F8F6E] to-[#1A7F64] text-white placeholder-gray-300",
//                         "focus:ring-2 focus:ring-[#2ABFA1] hover:ring-2 hover:ring-[#2ABFA1] focus:outline-none",
//                         "shadow-lg hover:shadow-[#2ABFA1]/30",
//                         props.disabled && "cursor-not-allowed opacity-50",
//                         props.left && "md:rounded",
//                         props.small && "text-sm sm:p-2"
//                     )}
//                     ref={props.inputRef as RefObject<HTMLTextAreaElement>}
//                     placeholder={props.placeholder}
//                     value={props.value}
//                     onChange={props.onChange}
//                     disabled={props.disabled}
//                     onKeyDown={props.onKeyDown}
//                     {...props.attributes}
//                 />
//             ) : (
//                 <input
//                     className={clsx(
//                         "w-full rounded-lg border border-transparent bg-opacity-10 backdrop-blur-md p-3 text-sm md:text-lg transition-all duration-300",
//                         "bg-gradient-to-r from-[#1A7F64] via-[#1F8F6E] to-[#1A7F64] text-white placeholder-gray-300",
//                         "focus:ring-2 focus:ring-[#2ABFA1] hover:ring-2 hover:ring-[#2ABFA1] focus:outline-none",
//                         "shadow-lg hover:shadow-[#2ABFA1]/30",
//                         props.disabled && "cursor-not-allowed opacity-50",
//                         props.left && "md:rounded-l-none",
//                         props.small && "text-sm sm:p-2"
//                     )}
//                     ref={props.inputRef as RefObject<HTMLInputElement>}
//                     placeholder={props.placeholder}
//                     type={props.type}
//                     value={props.value}
//                     onChange={props.onChange}
//                     disabled={props.disabled}
//                     onKeyDown={props.onKeyDown}
//                     {...props.attributes}
//                 />
//             )}
//         </div>
//     );
// };

// export default Input;
