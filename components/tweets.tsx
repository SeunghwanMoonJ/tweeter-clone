import { Tweet, User } from "@prisma/client";
import { useRouter } from "next/router";
import useSWR from "swr";
import LoadingCircles from "./loadingCircle";
import Image from "next/image";
import first from "../img/first.png";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import useUser from "@libs/client/useUser";
import { useState } from "react";
import CommectPopUp from "./commectPopUp";

interface TweetsResponse {
  tweets: TweetAddCountAndUser[];
}
interface TweetAddCountAndUser extends Tweet {
  user: User;
  _count: { Like: number; Comment: number };
  Like: { userId?: number }[];
}
interface useUserForm {
  user: User;
}
interface StateForm {
  id: number;
  name: string;
  text: string;
  time: Date;
}

export default function Tweets() {
  const router = useRouter();
  const { data, mutate } = useSWR<TweetsResponse>("/api/tweet");
  const { user }: useUserForm = useUser();
  const [showCommentPopUp, setShowCommentPopUp] = useState(false);
  const [clickedTweet, setClickedTweet] = useState<StateForm>();

  const goTweet = (id: number) => {
    router.push(`/tweet/${id}`);
  };
  const onClickComment = (tweet: StateForm) => {
    setClickedTweet(tweet);
    setShowCommentPopUp(true);
  };
  const onClickLike = (id: number) => {
    if (!data) return;

    fetch(`/api/tweet/${id}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    mutate(
      {
        ...data,
        tweets: data.tweets.map((tweet) => {
          if (tweet.id === id)
            return {
              ...tweet,
              Like: [
                tweet.Like[0]?.userId === user?.id ? {} : { userId: user?.id },
              ],
              _count: {
                ...tweet._count,
                Like:
                  tweet.Like[0]?.userId === user?.id
                    ? tweet._count.Like - 1
                    : tweet._count.Like + 1,
              },
            };
          return tweet;
        }),
      },
      false
    );
  };

  return (
    <div className="pt-6">
      <AnimatePresence>
        {showCommentPopUp && clickedTweet ? (
          <CommectPopUp
            setShowCommentPopUp={setShowCommentPopUp}
            tweet={clickedTweet}
          />
        ) : null}
      </AnimatePresence>
      <div className="flex flex-col-reverse">
        {data?.tweets ? (
          data.tweets.map((tweet) => (
            <div
              key={tweet.id}
              className="py-3 border-b border-b-gray-600 flex relative"
            >
              <div className="px-5">
                <div>
                  <Image
                    src={first}
                    height={60}
                    width={60}
                    className="object-cover object-center
                     aspect-square rounded-full bg-gray-300"
                  />
                  {/* <img
                    src={first}
                    className="cursor-pointer object-cover object-center h-12
                     aspect-square rounded-full bg-gray-300"
                  /> */}
                </div>
              </div>
              <div className="text-gray-50 flex flex-col w-[420px] ">
                <div className="text-md font-bold">
                  {tweet.user.name} ·{" "}
                  <span className="text-sm font-normal">
                    {moment(tweet.createdAt).startOf("minute").fromNow()}
                  </span>
                </div>
                <motion.div
                  whileHover={{ y: -1 }}
                  onClick={() => goTweet(tweet.id)}
                  style={{ wordBreak: "break-all" }}
                  className="text-md flex whitespace-normal break-words cursor-pointer"
                >
                  {tweet.text}
                </motion.div>
                <div className="flex justify-around items-center pt-2 pr-14">
                  <motion.div
                    whileHover={{ y: -1 }}
                    className="flex space-x-1 items-center group cursor-pointer"
                    onClick={() =>
                      onClickComment({
                        id: tweet.id,
                        name: tweet.user.name,
                        text: tweet.text,
                        time: tweet.createdAt,
                      })
                    }
                  >
                    <div
                      className="p-2 rounded-full group-hover:bg-sky-500 group-hover:bg-opacity-10
                     transition-colors group-hover:fill-sky-400 fill-gray-400"
                    >
                      <svg
                        className="w-5 h-5"
                        fill=""
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div className="text-sm group-hover:text-sky-400 transition-colors">
                      {tweet._count.Comment}
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -1 }}
                    className="flex space-x-1 items-center group cursor-pointer"
                    onClick={() => {
                      onClickLike(tweet.id);
                    }}
                  >
                    {!tweet.Like[0]?.userId ? (
                      <div
                        className="p-2 rounded-full group-hover:bg-pink-600 group-hover:bg-opacity-10
                    transition-colors group-hover:text-pink-600 text-gray-400"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          ></path>
                        </svg>
                      </div>
                    ) : (
                      <div
                        className="p-2 rounded-full hover:bg-pink-600 hover:bg-opacity-10
                      transition-colors hover:text-pink-600 fill-pink-600"
                      >
                        <svg
                          className="w-5 h-5"
                          fill=""
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                    )}
                    <div className="group-hover:text-pink-500 transition-colors">
                      {tweet._count.Like}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <LoadingCircles />
        )}
      </div>
    </div>
  );
}
