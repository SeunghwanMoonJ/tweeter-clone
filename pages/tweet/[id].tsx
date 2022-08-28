import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import first from "../../img/first.png";
import moment from "moment";
import { Comment, Tweet, User } from "@prisma/client";
import LoadingCircles from "@components/loadingCircle";
import useMutation from "@libs/client/useMutation";
import { useState } from "react";
import CommectPopUp from "@components/commectPopUp";

interface TweetForm {
  ok: boolean;
  tweet: UpgradedTweet;
  isLiked: boolean;
}
interface UpgradedTweet extends Tweet {
  user: User;
  _count: { Like: number; Comment: number };
  Comment: UpgradedComment[];
}
interface UpgradedComment extends Comment {
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
  const { data, mutate } = useSWR<TweetForm>(
    router.query.id ? `/api/tweet/${router.query.id}` : null
  );

  const [toggleLike] = useMutation(`/api/tweet/${router.query.id}/like`);
  const [showCommentPopUp, setShowCommentPopUp] = useState(false);
  const [currentTweet, setCurrentTweet] = useState<StateForm>();

  const onClickLike = () => {
    toggleLike({});
    if (!data) return;
    mutate(
      {
        ...data,
        isLiked: !data.isLiked,
        tweet: {
          ...data?.tweet,
          _count: {
            ...data?.tweet?._count,
            Like: data?.isLiked
              ? data?.tweet?._count?.Like - 1
              : data?.tweet?._count?.Like + 1,
          },
        },
      },
      false
    );
  };
  const onClickComment = () => {
    if (!data) return;
    setCurrentTweet({
      id: data?.tweet.id,
      name: data?.tweet.user.name,
      text: data?.tweet.text,
      time: data?.tweet.createdAt,
    });
    setShowCommentPopUp(true);
  };
  return (
    <Layout hasTabBar canGoBack title="Tweet">
      <AnimatePresence>
        {showCommentPopUp && data?.tweet ? (
          <CommectPopUp
            setShowCommentPopUp={setShowCommentPopUp}
            tweet={currentTweet!}
          />
        ) : null}
      </AnimatePresence>
      {data?.tweet ? (
        <>
          <div key={data.tweet.id} className="pt-20 border-b border-b-gray-600">
            <div className="px-5 flex">
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
              <div className="text-gray-50 flex justify-center  text-md font-bold mt-2 ml-2">
                {data.tweet.user.name}
              </div>
            </div>

            <div className="ml-5 mt-2 w-[500px]">
              <div
                style={{ wordBreak: "break-all" }}
                className="text-gray-50 text-2xl font-bold flex whitespace-normal break-words"
              >
                {data.tweet.text}
              </div>
              <p className="text-gray-400 text-sm font-normal mt-3">
                {moment(data.tweet.createdAt).format("h:mm:ss A, MMMM Do YYYY")}
              </p>
              <div className="flex items-center space-x-3 py-2 mt-4 pr-14 border-y border-y-gray-600">
                <div className="flex space-x-1 items-baseline justify-center">
                  <div className="text-sm font-bold text-gray-50">
                    {data.tweet._count.Comment}
                  </div>
                  <div className="text-xs text-gray-300">Commects</div>
                </div>
                <div className="flex space-x-1 items-baseline justify-center">
                  <div className="text-sm font-bold text-gray-50">
                    {data.tweet._count.Like}
                  </div>
                  <div className="text-xs text-gray-300">Likes</div>
                </div>
              </div>
              <div className="flex justify-around items-center py-2 pr-10">
                <div
                  onClick={onClickComment}
                  className="p-2 rounded-full hover:bg-sky-500 hover:bg-opacity-10
                     transition-colors hover:fill-sky-400 fill-gray-400"
                >
                  <svg
                    className="w-7 h-7"
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
                {!data.isLiked ? (
                  <div
                    className="p-2 rounded-full hover:bg-pink-600 hover:bg-opacity-10
                    transition-colors hover:text-pink-600 text-gray-400"
                    onClick={onClickLike}
                  >
                    <svg
                      className="w-7 h-7"
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
                    onClick={onClickLike}
                  >
                    <svg
                      className="w-7 h-7"
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
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse">
            {data?.tweet.Comment ? (
              data.tweet.Comment.map((Comment) => (
                <div
                  key={Comment.id}
                  className="py-3 border-b border-b-gray-600 flex relative"
                >
                  <div className="px-5">
                    <div>
                      <Image
                        src={first}
                        height={60}
                        width={60}
                        className="cursor-pointer object-cover object-center
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
                      {Comment.user.name} ·{" "}
                      <span className="text-sm font-normal">
                        {moment(Comment.createdAt).startOf("minute").fromNow()}
                      </span>
                    </div>
                    <div
                      style={{ wordBreak: "break-all" }}
                      className="text-md flex whitespace-normal break-words"
                    >
                      {Comment.text}
                    </div>
                    {/* <div className="flex justify-around items-center pt-2 pr-14">
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
                    </div> */}
                  </div>
                </div>
              ))
            ) : (
              <LoadingCircles />
            )}
          </div>{" "}
        </>
      ) : (
        <LoadingCircles />
      )}
    </Layout>
  );
}
