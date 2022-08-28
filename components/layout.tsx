import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { cls } from "@libs/client/utils";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import { motion } from "framer-motion";

interface LayoutProps {
  title?: string;
  canGoBack?: boolean;
  hasTabBar?: boolean;
  children: React.ReactNode;
}
interface MutationResult {
  ok: boolean;
}
function Layout({ title, canGoBack, children }: LayoutProps) {
  const router = useRouter();
  const [byebye, { loading, data }] =
    useMutation<MutationResult>("/api/users/logout");
  const { user } = useUser();
  const onClickBackButton = () => {
    router.back();
  };
  const onClickLogout = () => {
    byebye();
  };

  useEffect(() => {
    if (data?.ok) {
      router.push("/");
    }
  }, [data, router]);

  return (
    <div className="min-h-screen min-w-full bg-black">
      <div className="bg-black flex max-w-xl mx-auto min-h-screen">
        <nav
          className="pt-10 pr-10 space-y-6 bg-black max-w-[30px]
         flex flex-col items-center w-full text-gray-300"
        >
          <Link href="/home">
            <a
              className={cls(
                router.pathname === "/home" ? "text-sky-500" : "text-white",
                "flex flex-col items-center space-y-1 group relative"
              )}
            >
              <div
                className="p-3 rounded-full group-hover:bg-sky-500 group-hover:bg-opacity-50
               transition-colors"
              >
                <svg
                  className="fill-gray-300 w-8 h-8"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path d="M511.8 287.6L512.5 447.7C512.6 483.2 483.9 512 448.5 512H128.1C92.75 512 64.09 483.3 64.09 448V287.6H32.05C14.02 287.6 0 273.5 0 255.5C0 246.5 3.004 238.5 10.01 231.5L266.4 8.016C273.4 1.002 281.4 0 288.4 0C295.4 0 303.4 2.004 309.5 7.014L416 100.7V64C416 46.33 430.3 32 448 32H480C497.7 32 512 46.33 512 64V185L564.8 231.5C572.8 238.5 576.9 246.5 575.8 255.5C575.8 273.5 560.8 287.6 543.8 287.6L511.8 287.6zM288 288C323.3 288 352 259.3 352 224C352 188.7 323.3 160 288 160C252.7 160 224 188.7 224 224C224 259.3 252.7 288 288 288zM192 416H384C392.8 416 400 408.8 400 400C400 355.8 364.2 320 320 320H256C211.8 320 176 355.8 176 400C176 408.8 183.2 416 192 416z" />
                </svg>
              </div>
              <p
                className="opacity-0 text-xs text-sky-400 group-hover:opacity-100 absolute
               font-bold -bottom-5 transition-all"
              >
                Home
              </p>
            </a>
          </Link>
          <div>
            <a
              className={cls(
                router.pathname === `/profile/${user?.id}`
                  ? "border-b border-sky-500"
                  : "",
                "flex flex-col items-center space-y-1 group relative"
              )}
            >
              <div
                className="p-2 rounded-full group-hover:bg-sky-500 group-hover:bg-opacity-50
               transition-colors group-active:bg-red-500"
              >
                <svg
                  className="w-9 h-9"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
              <p
                className="opacity-0 text-xs text-sky-500 group-hover:opacity-100 absolute
               font-bold -bottom-5 transition-all group-active:text-red-500"
              >
                Profile
              </p>
            </a>
          </div>
          <div className="group relative flex flex-col items-center space-y-1">
            <button
              onClick={onClickLogout}
              className="p-3 rounded-full group-hover:bg-pink-500 group-hover:bg-opacity-50
               transition-colors"
            >
              <a>
                <svg
                  className="w-7 h-7 fill-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M160 416H96c-17.67 0-32-14.33-32-32V128c0-17.67 14.33-32 32-32h64c17.67 0 32-14.33 32-32S177.7 32 160 32H96C42.98 32 0 74.98 0 128v256c0 53.02 42.98 96 96 96h64c17.67 0 32-14.33 32-32S177.7 416 160 416zM502.6 233.4l-128-128c-12.51-12.51-32.76-12.49-45.25 0c-12.5 12.5-12.5 32.75 0 45.25L402.8 224H192C174.3 224 160 238.3 160 256s14.31 32 32 32h210.8l-73.38 73.38c-12.5 12.5-12.5 32.75 0 45.25s32.75 12.5 45.25 0l128-128C515.1 266.1 515.1 245.9 502.6 233.4z" />
                </svg>
              </a>
            </button>
            <p
              className="opacity-0 text-xs text-pink-300 group-hover:opacity-100
             absolute font-bold -bottom-5 transition-all"
            >
              Logout
            </p>
          </div>
        </nav>
        <div className="border-x-[0.01px] border-x-gray-600 w-full">
          <div
            className="bg-opacity-60 bg-black w-full font-medium text-lg py-2 fixed
         max-w-2xl text-white top-0 flex item-center justify-start bg z-30"
          >
            {canGoBack ? (
              <motion.button
                onClick={onClickBackButton}
                whileHover={{ scale: 1.1 }}
                className="ml-5 text-xl text-white rounded-full"
              >
                &larr;
              </motion.button>
            ) : null}
            {title ? <span className="ml-5">{title}</span> : null}
          </div>
          <div className="w-full overflow-auto h-screen scrollbar-hide">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
