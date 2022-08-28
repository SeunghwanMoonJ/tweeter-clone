import Image from "next/image";
import React, { useState } from "react";
import first from "../img/first.png";
import { AnimatePresence } from "framer-motion";
import SignUpPopUp from "../components/signUpPopUp";
import LogInPopUp from "@components/logInPopUp";

export default () => {
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const onSignUpButtonClick = () => {
    setShowSignUpForm(true);
  };

  const [showLogInForm, setShowLogInForm] = useState(false);
  const onLogIpButtonClick = () => {
    setShowLogInForm(true);
  };

  return (
    <div
      className="lg:h-screen flex flex-col-reverse bg-black text-white
      lg:flex-row lg:items-center"
    >
      <div>
        <Image
          src={first}
          // layout="fill" // required
          objectFit="contain" // change to suit your needs
        />
      </div>
      <div className="pt-10 px-10 space-y-12 shrink-0">
        <div className="text-white fill-white w-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M288 167.2V139.1c-28.25-36.38-47.13-79.29-54.13-125.2C231.7 .4054 214.8-5.02 206.1 5.481C184.1 30.36 168.4 59.7 157.2 92.07C191.4 130.3 237.2 156.7 288 167.2zM400 63.97c-44.25 0-79.1 35.82-79.1 80.08l.0014 59.44c-104.4-6.251-193-70.46-233-161.7C81.48 29.25 63.76 28.58 58.01 40.83C41.38 75.96 32.01 115.2 32.01 156.6c0 70.76 34.11 136.9 85.11 185.9c13.12 12.75 26.13 23.27 38.88 32.77L12.12 411.2c-10.75 2.75-15.5 15.09-9.5 24.47c17.38 26.88 60.42 72.54 153.2 76.29c8 .25 15.99-2.633 22.12-7.883l65.23-56.12l76.84 .0561c88.38 0 160-71.49 160-159.9l.0013-160.2l31.1-63.99L400 63.97zM400 160.1c-8.75 0-16.01-7.259-16.01-16.01c0-8.876 7.261-16.05 16.01-16.05s15.99 7.136 15.99 16.01C416 152.8 408.8 160.1 400 160.1z" />
          </svg>
        </div>
        <div className="text-6xl font-extrabold">지금 일어나고 있는 일</div>
        <div className="pl-1 text-2xl font-bold">오늘 트위터에 가입하세요.</div>
        <div className="max-w-xs">
          <button
            className="p-2.5 bg-white w-full rounded-3xl text-sm text-gray-600
         hover:bg-slate-100 transition-colors active:bg-red-600"
          >
            <span className="text-black">Google</span> 계정으로 가입하기
          </button>
          <button
            className="p-2.5 mt-3 bg-white w-full rounded-3xl text-sm text-gray-600
         hover:bg-slate-100 transition-colors active:bg-red-600"
          >
            <span className="text-black font-bold">Apple</span> 에서 가입하기
          </button>
          <div className="relative mt-3">
            <div className="absolute border-t border-t-gray-100 w-full"></div>
            <div className="relative -top-3 text-center">
              <span className="px-2 bg-black text-white text-sm">또는</span>
            </div>
          </div>
          <button
            onClick={onSignUpButtonClick}
            className="p-2.5 bg-sky-500 w-full -mt-4 rounded-3xl text-sm text-white
         font-bold hover:bg-sky-600 transition-colors"
          >
            <span className="">휴대폰 번호나 이메일 주소로 가입하기</span>
          </button>
          <p className="text-gray-500 text-xs leading-1 mt-3">
            가입하시려면 <span className="text-sky-600">쿠키 사용</span>을
            포함해
            <span className="text-sky-600"> 이용 약관</span>과
            <span className="text-sky-600"> 개인정보 처리방침</span>에 동의해야
            합니다.
          </p>
          <p className="text-white text-lg mt-14 font-bold">
            이미 트위터에 가입하셨나요?
          </p>
          <button
            onClick={onLogIpButtonClick}
            className="p-2.5 text-sky-500 w-full mt-4 mb-8 rounded-3xl text-sm
         font-bold hover:bg-opacity-10 hover:bg-sky-200 transition-colors border-gray-500 border"
          >
            <span>로그인</span>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {showSignUpForm ? (
          <SignUpPopUp setShowSignUpForm={setShowSignUpForm} />
        ) : null}
        {showLogInForm ? (
          <LogInPopUp setShowLogInForm={setShowLogInForm} />
        ) : null}
      </AnimatePresence>
    </div>
  );
};
