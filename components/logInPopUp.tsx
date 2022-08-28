import useMutation from "@libs/client/useMutation";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface PopUpForm {
  setShowLogInForm: React.Dispatch<React.SetStateAction<boolean>>;
}
interface IForm {
  password: string;
  phoneOrEmail: string;
}
interface MutationResult {
  ok: boolean;
  loginFailed: boolean;
}

export default function ({ setShowLogInForm }: PopUpForm) {
  const [createUser, { data }] =
    useMutation<MutationResult>("api/users/confirm");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<IForm>();

  const onPopUpXClick = () => {
    setShowLogInForm(false);
  };

  const onValid = (userData: IForm) => {
    createUser(userData);
  };
  const router = useRouter();
  useEffect(() => {
    if (data?.ok) {
      setShowLogInForm(false);
      router.push("home");
    }
    if (data?.loginFailed) {
      setError(
        "phoneOrEmail",
        { message: "아이디 혹은 비밀번호를 확인하세요." },
        { shouldFocus: true }
      );
    }
  }, [data, router]);

  return (
    <div className="w-full h-full top-0 fixed bg-gray-700 bg-opacity-40 z-10">
      <form onSubmit={handleSubmit(onValid)}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: "tween" }}
          className="shadow-lg p-5 px-20 fixed z-20 top-1/4 opacity-100 left-0 right-0
             mx-auto bg-black w-[600px] rounded-2xl"
        >
          <div className="flex flex-col">
            <div onClick={onPopUpXClick} className="flex fill-white font-thin">
              <div
                className="p-2 hover:rounded-full hover:border-white
              hover:bg-gray-700 hover:bg-opacity-40 cursor-pointer"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                >
                  <path d="M376.6 427.5c11.31 13.58 9.484 33.75-4.094 45.06c-5.984 4.984-13.25 7.422-20.47 7.422c-9.172 0-18.27-3.922-24.59-11.52L192 305.1l-135.4 162.5c-6.328 7.594-15.42 11.52-24.59 11.52c-7.219 0-14.48-2.438-20.47-7.422c-13.58-11.31-15.41-31.48-4.094-45.06l142.9-171.5L7.422 84.5C-3.891 70.92-2.063 50.75 11.52 39.44c13.56-11.34 33.73-9.516 45.06 4.094L192 206l135.4-162.5c11.3-13.58 31.48-15.42 45.06-4.094c13.58 11.31 15.41 31.48 4.094 45.06l-142.9 171.5L376.6 427.5z" />
                </svg>
              </div>
            </div>
            <div className="px-16 flex flex-col h-[55vh] overflow-y-auto">
              <p className="mt-10 text-3xl font-bold">트위터에 로그인하기</p>
              <div
                className="p-2.5 bg-white mt-9 w-full rounded-3xl text-sm text-gray-600
         hover:bg-slate-100 transition-colors active:bg-red-600 text-center"
              >
                <span className="text-black">Google</span> 계정으로 계속하기
              </div>
              <div
                className="p-2.5 mt-7 bg-white w-full rounded-3xl text-sm text-gray-600
         hover:bg-slate-100 transition-colors active:bg-red-600 text-center"
              >
                <span className="text-black font-bold">Apple</span> 에서
                계속하기
              </div>
              <div className="relative mt-7">
                <div className="absolute border-t border-t-gray-100 w-full"></div>
                <div className="relative -top-3 text-center">
                  <span className="px-2 bg-black text-white text-sm">또는</span>
                </div>
              </div>
              <input
                {...register("phoneOrEmail", {
                  required: "휴대폰 번호 또는 이메일 주소를 입력해주세요.",
                  minLength: {
                    value: 3,
                    message: "3글자 이상 입력해주세요.",
                  },
                })}
                required
                name="phoneOrEmail"
                type="text"
                placeholder="휴대폰 번호 또는 이메일 주소"
                className="p-2 mt-3 rounded-md bg-transparent border border-gray-500
                  focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <span className={errors.phoneOrEmail && "-mb-6"}>
                {errors?.phoneOrEmail?.message as any}
              </span>

              <input
                {...register("password", {
                  required: "비밀번호를 입력해주세요.",
                  minLength: {
                    value: 5,
                    message: "5글자 이상 입력해주세요.",
                  },
                })}
                name="password"
                type="password"
                placeholder="비밀번호"
                className="form-control p-2 mt-7 rounded-md bg-transparent border border-gray-500
                  focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <span className={errors.password && "-mb-6"}>
                {errors?.password?.message as any}
              </span>
              <button
                className="p-2.5 bg-white mt-8 w-full rounded-3xl text-sm text-gray-600
         hover:bg-slate-100 transition-colors"
              >
                <span className="text-black font-bold">로그인</span>
              </button>
              {/* <p className="mx-1 mt-2 text-white font-bold">생년월일</p>
                  <p className="mx-1 text-gray-700 text-xs leading-1">
                    이 정보는 공개적으로 표시되지 않습니다. 비즈니스, 반려동물
                    등 계정 주제에 상관없이 나의 연령을 확인하세요.
                  </p>
                  <div className="flex justify-between">
                    <input type="" />
                  </div> */}
            </div>
          </div>
        </motion.div>
      </form>
    </div>
  );
}
