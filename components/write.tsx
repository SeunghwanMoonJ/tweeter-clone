import React, { useEffect, useState } from "react";
import Link from "next/link";
import TextareaAutosize from "react-textarea-autosize";
import { cls } from "@libs/client/utils";
import { useForm } from "react-hook-form";
import { User } from "@prisma/client";
import useUser from "@libs/client/useUser";
import { motion } from "framer-motion";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import Image from "next/image";
import first from "../img/first.png";

interface IForm {
  text: string;
}
interface useUserForm {
  user: User;
  isLoading: boolean;
}

export default function Write() {
  const [tweet, { loading, data }] = useMutation("/api/tweet");
  const router = useRouter();
  const { user, isLoading }: useUserForm = useUser();
  const [count, setCount] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    // setError,
    // setValue,
  } = useForm<IForm>();

  const onValid = (text: IForm) => {
    if (loading) return;
    tweet(text);
  };

  useEffect(() => {
    if (data && data.ok) {
      router.push(`/tweet/${data.tweet.id}`);
    }
  }, [data, router]);

  return (
    <div className="w-full pt-16 pl-5 pb-2 flex border-b border-b-gray-600">
      <motion.div whileHover={{ y: -1 }}>
        <Link href={`/profile/${user?.id}`}>
          <Image
            src={first}
            height={60}
            width={60}
            className="cursor-pointer object-cover object-center
                     aspect-square rounded-full bg-gray-300"
          />
        </Link>
      </motion.div>
      <div>
        <form onSubmit={handleSubmit(onValid)}>
          <TextareaAutosize
            {...register("text", {
              required: "내용을 입력해주세요",
              minLength: {
                value: 5,
                message: "5글자 이상 입력해주세요.",
              },
            })}
            className="bg-transparent pl-1 pb-0 ml-3 text-xl text-gray-100 w-[450px] border-0
        focus:ring-0 resize-none"
            maxLength={400}
            placeholder="What's happenig?"
            onChange={(e) => setCount(e.target.value.length)}
          ></TextareaAutosize>

          {count > 0 ? (
            <>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.5 }}
                transition={{ type: "tween" }}
                className="text-sky-300 text-xs flex flex-row-reverse p-5 py-0"
              >
                {count}/400
              </motion.p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.5 }}
                transition={{ type: "tween", duration: 0.2 }}
                className="border-t border-t-gray-700 mt-3 mx-4"
              />
            </>
          ) : null}
          <p className="text-gray-700 text-xs ml-5 mt-2">
            {errors?.text?.message as any}
          </p>
          <div className="p-3 mt-5 flex justify-between">
            <div>
              <motion.div
                whileHover={{ y: -1 }}
                className="hover:bg-sky-500 hover:bg-opacity-10 rounded-full w-10 h-10
               flex items-center justify-center transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-6 h-6  fill-sky-400"
                >
                  <path d="M447.1 32h-384C28.64 32-.0091 60.65-.0091 96v320c0 35.35 28.65 64 63.1 64h384c35.35 0 64-28.65 64-64V96C511.1 60.65 483.3 32 447.1 32zM111.1 96c26.51 0 48 21.49 48 48S138.5 192 111.1 192s-48-21.49-48-48S85.48 96 111.1 96zM446.1 407.6C443.3 412.8 437.9 416 432 416H82.01c-6.021 0-11.53-3.379-14.26-8.75c-2.73-5.367-2.215-11.81 1.334-16.68l70-96C142.1 290.4 146.9 288 152 288s9.916 2.441 12.93 6.574l32.46 44.51l93.3-139.1C293.7 194.7 298.7 192 304 192s10.35 2.672 13.31 7.125l128 192C448.6 396 448.9 402.3 446.1 407.6z" />
                </svg>
              </motion.div>
            </div>
            <button
              className={cls(
                count > 0
                  ? "bg-sky-400 hover:bg-sky-600"
                  : "bg-sky-400 bg-opacity-60 ",
                "rounded-3xl px-6 py-1 font-bold text-gray-100 "
              )}
            >
              Tweet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
