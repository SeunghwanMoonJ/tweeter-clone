import useMutation from "@libs/client/useMutation";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface PopUpForm {
  setShowSignUpForm: React.Dispatch<React.SetStateAction<boolean>>;
}
interface IForm {
  name: string;
  password: string;
  password1: string;
  phone: string;
  email: string;
}
interface MutationResult {
  ok: boolean;
  userExists: boolean;
}

export default function ({ setShowSignUpForm }: PopUpForm) {
  const [createUser, { data }] =
    useMutation<MutationResult>("api/users/create");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<IForm>();
  const [isUserWantEmail, setIsUserWantEmail] = useState(false);
  const onPopUpXClick = () => {
    setShowSignUpForm(false);
  };
  const toggleEmailPhone = () => {
    setIsUserWantEmail((prev) => !prev);
    setValue("email", "");
    setValue("phone", "");
  };
  const onValid = (userData: IForm) => {
    if (userData.password !== userData.password1) {
      setError(
        "password1",
        { message: "비밀번호가 일치하지 않습니다." },
        { shouldFocus: true }
      );
    }
    createUser(userData);
  };
  const router = useRouter();
  useEffect(() => {
    console.log(data);
    if (data?.userExists) {
      setError(
        isUserWantEmail ? "email" : "phone",
        { message: "이미 존재하는 사용자 정보입니다." },
        { shouldFocus: true }
      );
    }
    if (data?.ok) {
      alert("트위터 가입을 환영합니다!");
      setShowSignUpForm(false);
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
          className="shadow-lg p-5 fixed z-20 top-1/4 opacity-100 left-0 right-0
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
              <p className="mt-10 text-3xl font-bold">계정을 생성하세요.</p>
              <input
                {...register("name", {
                  required: "이름을 입력해주세요.",
                  minLength: {
                    value: 3,
                    message: "3글자 이상 입력해주세요.",
                  },
                })}
                required
                name="name"
                type="text"
                placeholder="이름"
                className="p-3 mt-7 rounded-md bg-transparent border border-gray-500
                  focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <span className={errors.name && "-mb-6"}>
                {errors?.name?.message as any}
              </span>

              {isUserWantEmail ? (
                <>
                  <input
                    {...register("email", {
                      pattern: {
                        value:
                          /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                        message: "유효한 이메일 주소가 아닙니다.",
                      },
                      required: "이메일을 입력해주세요.",
                      minLength: {
                        value: 5,
                        message: "5글자 이상 입력해주세요.",
                      },
                    })}
                    name="email"
                    type="email"
                    placeholder="이메일"
                    className="p-3 mt-7 rounded-md bg-transparent border border-gray-500
                  focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                  <span className={errors.email && "-mb-6"}>
                    {errors?.email?.message as any}
                  </span>
                </>
              ) : (
                <>
                  <input
                    {...register("phone", {
                      required: "휴대폰 번호를 입력해주세요.",
                      minLength: {
                        value: 5,
                        message: "5글자 이상 입력해주세요",
                      },
                    })}
                    name="phone"
                    type="text"
                    placeholder="휴대폰"
                    className="form-control p-3 mt-7 rounded-md bg-transparent border border-gray-500
                  focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                  {errors.phone ? (
                    <span className="-mb-6">
                      {errors?.phone?.message as any}
                    </span>
                  ) : null}
                </>
              )}
              <p
                onClick={toggleEmailPhone}
                className="mt-2 text-sky-600 text-sm flex justify-end
                   cursor-pointer hover:underline"
              >
                {isUserWantEmail
                  ? "대신 휴대폰 사용하기"
                  : "대신 이메일 사용하기"}
              </p>
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
                className="form-control p-3 mt-7 rounded-md bg-transparent border border-gray-500
                  focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <span className={errors.password && "-mb-6"}>
                {errors?.password?.message as any}
              </span>
              <input
                {...register("password1", {
                  required: "비밀번호를 확인해주세요.",
                  minLength: {
                    value: 5,
                    message: "5글자 이상 입력해주세요.",
                  },
                })}
                name="password1"
                type="password"
                placeholder="비밀번호 확인"
                className="form-control p-3 mt-7 rounded-md bg-transparent border border-gray-500
                  focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <span className={errors.password1 && "-mb-6"}>
                {errors?.password1?.message as any}
              </span>
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
          <div
            className="absolute p-6 rounded-2xl -mx-5 px-16 -bottom-7 w-full bg-black
           flex justify-center items-center"
          >
            <button
              className="p-4 rounded-3xl w-full 
                max-w-[432px] bg-slate-400 text-black font-bold"
            >
              계정 생성
            </button>
          </div>
        </motion.div>
      </form>
    </div>
  );
}
