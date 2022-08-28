import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import { cls } from "@libs/client/utils";
import { User } from "@prisma/client";
import { motion } from "framer-motion";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import first from "../img/first.png";

interface PopUpForm {
  setShowCommentPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  tweet: StateForm;
}
interface IForm {
  text: string;
}
interface MutationResult {
  ok: boolean;
  loginFailed: boolean;
}
interface useUserForm {
  user: User;
  isLoading: boolean;
}
interface StateForm {
  id: number;
  name: string;
  text: string;
  time: Date;
}
export default function ({ setShowCommentPopUp, tweet }: PopUpForm) {
  const { user, isLoading }: useUserForm = useUser();
  const [count, setCount] = useState(0);
  const [createReply, { data: replyData }] = useMutation<MutationResult>(
    `/api/tweet/${tweet.id}/comment`
  );
  console.log(tweet.id);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<IForm>();

  const onPopUpXClick = () => {
    setShowCommentPopUp(false);
  };

  const onValid = (reply: IForm) => {
    createReply(reply);
  };
  const router = useRouter();
  useEffect(() => {
    if (replyData?.ok) {
      setShowCommentPopUp(false);
      router.reload();
    }
  }, [replyData]);

  return (
    <div className="fixed left-0 right-0 mx-auto top-0 bottom-0 bg-gray-700 bg-opacity-40 z-40">
      <form onSubmit={handleSubmit(onValid)}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: "tween", duration: 0.2 }}
          className="shadow-lg p-5 fixed top-1/4 opacity-100 left-9 right-0
             mx-auto bg-black w-[500px] rounded-2xl"
        >
          <div className="flex flex-col">
            <div className="flex fill-white font-thin">
              <div
                onClick={onPopUpXClick}
                className="p-2 hover:rounded-full hover:border-white
              hover:bg-gray-700 hover:bg-opacity-40 cursor-pointer"
              >
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                >
                  <path d="M376.6 427.5c11.31 13.58 9.484 33.75-4.094 45.06c-5.984 4.984-13.25 7.422-20.47 7.422c-9.172 0-18.27-3.922-24.59-11.52L192 305.1l-135.4 162.5c-6.328 7.594-15.42 11.52-24.59 11.52c-7.219 0-14.48-2.438-20.47-7.422c-13.58-11.31-15.41-31.48-4.094-45.06l142.9-171.5L7.422 84.5C-3.891 70.92-2.063 50.75 11.52 39.44c13.56-11.34 33.73-9.516 45.06 4.094L192 206l135.4-162.5c11.3-13.58 31.48-15.42 45.06-4.094c13.58 11.31 15.41 31.48 4.094 45.06l-142.9 171.5L376.6 427.5z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="pt-5 flex">
            <div>
              <Image
                src={first}
                height={50}
                width={50}
                className="cursor-pointer object-cover object-center
                     aspect-square rounded-full bg-gray-300"
              />
              {/* <img
                    src={first}
                    className="cursor-pointer object-cover object-center h-12
                     aspect-square rounded-full bg-gray-300"
                  /> */}
            </div>
            <div className="w-[340px] pl-3">
              <div className="text-gray-50 flex items-center text-md font-bold mt-2">
                {tweet?.name} ·
                <span className="ml-1 text-sm font-normal">
                  {moment(tweet.time).format("MMMM DD")}
                </span>
              </div>
              <div
                style={{ wordBreak: "break-all" }}
                className="text-gray-50 text-lg flex whitespace-normal break-words "
              >
                {tweet.text}
              </div>
              <div
                style={{ wordBreak: "break-all" }}
                className="mt-3 text-gray-50 text-md flex whitespace-normal break-words "
              >
                <span className="text-gray-500 mr-1">replying to</span>{" "}
                {tweet.name}
              </div>
            </div>
          </div>
          <div className="flex mt-4">
            <div className="pt-2">
              <Image
                src={first}
                height={50}
                width={50}
                className="object-cover object-center
                     aspect-square rounded-full bg-gray-300"
              />
            </div>
            <div className="flex items-end justify-between">
              <TextareaAutosize
                {...register("text", {
                  required: "내용을 입력해주세요",
                  minLength: {
                    value: 5,
                    message: "5글자 이상 입력해주세요.",
                  },
                })}
                className="bg-transparent text-xl text-gray-100
               w-[340px] border-0 focus:ring-0 resize-none"
                maxLength={100}
                placeholder="Tweet your reply"
                onChange={(e) => setCount(e.target.value.length)}
              ></TextareaAutosize>

              {count > 0 ? (
                <>
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.5 }}
                    transition={{ type: "tween" }}
                    className="text-sky-300 text-xs flex flex-row-reverse
                  pb-3"
                  >
                    {count}/100
                  </motion.p>
                </>
              ) : null}
              <p className="text-gray-700 text-xs ml-5 mt-2">
                {errors?.text?.message as any}
              </p>
            </div>
          </div>
          <div>
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
                Reply
              </button>
            </div>
          </div>
        </motion.div>
      </form>
    </div>
  );
}
