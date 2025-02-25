"use client";
import { LoginSchema } from "@/Type/types";
import AuthFormHeader from "../Reuseables/AuthFormHeader";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "../ui/button";
import AuthProvidersIcon from "./AuthProvidersIcon";
import { useState } from "react";
import { loginAction } from "@/Actions/actions";
import ErrorBox from "../Reuseables/ErrorBox";
import SuccessBox from "../Reuseables/SuccessBox";
import Link from "next/link";
import { AiOutlineLoading } from "react-icons/ai";
import { redirect } from "next/navigation";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<LoginSchema>();
  const onSubmit: SubmitHandler<LoginSchema> = async (data: LoginSchema) => {
    try {
      setIsLoading(true);
      const res = await loginAction(data);
      if (res!.success) {
        if (typeof res!.msg) {
          setSuccess(res!.msg);
          setTimeout(() => {
            redirect("/dashboard");
          }, 4000);
        }
      }
      if (!res!.success) {
        if (typeof res!.msg) {
          setError(res!.msg);
        }
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      reset();
      setIsLoading(false);
    }
  };
  if (error || success) {
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 5000);
  }
  return (
    <div>
      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className="w-[450px] border-gray-400 border-2 rounded-md p-4 shadow-xl dark:border-blue-400"
      >
        <AuthFormHeader />
        <div className="flex flex-col gap-4">
          <div>
            <input
              type="email"
              disabled={isLoading}
              {...register("email", { required: true, minLength: 1 })}
              placeholder="Email"
              className="w-full border-2 border-gray-400 rounded-md p-2 my-2 dark:border-blue-400 "
            />
            {errors.email && <p className="text-red-500">Email is required</p>}
          </div>
          <div>
            <input
              type="password"
              disabled={isLoading}
              {...register("password", { required: true, minLength: 6 })}
              placeholder="Password"
              className="w-full border-2 border-gray-400 rounded-md p-2 my-2 dark:border-blue-400"
            />
            {errors.password && (
              <p className="text-red-500">Password is required</p>
            )}
          </div>
        </div>
        <AuthProvidersIcon />

        {error && <ErrorBox text={error} />}
        {success && <SuccessBox text={success} />}
        <Button type="submit" className="w-full" disabled={isLoading}>
          Login{" "}
          {isLoading && <AiOutlineLoading className="animate-spin" size={20} />}
        </Button>
      </form>
      <div>
        Has no account? <Link href={"/auth/register"}>register</Link>
      </div>
    </div>
  );
};

export default Login;
