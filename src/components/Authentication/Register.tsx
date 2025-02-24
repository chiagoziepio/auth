"use client";

import { RegisterSchema } from "@/Type/types";
import AuthFormHeader from "../Reuseables/AuthFormHeader";
import { useForm, SubmitHandler } from "react-hook-form";
import AuthProvidersIcon from "./AuthProvidersIcon";
import { Button } from "../ui/button";
import { registerAction } from "@/Actions/actions";
import { useState } from "react";
import SuccessBox from "../Reuseables/SuccessBox";
import ErrorBox from "../Reuseables/ErrorBox";
import Link from "next/link";
import { AiOutlineLoading } from "react-icons/ai";
import { redirect } from "next/navigation";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterSchema>();

  if (error || success) {
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 5000);
  }

  const onSubmit: SubmitHandler<RegisterSchema> = async (
    data: RegisterSchema
  ) => {
    try {
      setIsLoading(true);
      const res = await registerAction(data);
      if (res.success) {
        setSuccess(res.msg);
        redirect("/auth/login");
      }
      if (!res.success) {
        if (typeof res.msg === "string") {
          setError(res.msg);
        } else {
          const errorMessages = res.msg
            .map((issue) => issue.message)
            .join(", ");
          setError(errorMessages);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      reset();
    }
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[450px] border-gray-400 border-2 rounded-md p-4 shadow-xl"
      >
        <AuthFormHeader />
        <div className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              disabled={isLoading}
              {...register("name", { required: true, minLength: 2 })}
              placeholder="Name"
              className="w-full border-2 border-gray-400 rounded-md p-2 my-2"
            />
            {errors.name && <p className="text-red-500">Name is required</p>}
          </div>
          <div>
            <input
              type="email"
              disabled={isLoading}
              {...register("email", { required: true, minLength: 1 })}
              placeholder="Email"
              className="w-full border-2 border-gray-400 rounded-md p-2 my-2"
            />
            {errors.email && <p className="text-red-500">Email is required</p>}
          </div>
          <div>
            <input
              type="password"
              disabled={isLoading}
              {...register("password", { required: true, minLength: 6 })}
              placeholder="Password"
              className="w-full border-2 border-gray-400 rounded-md p-2 my-2"
            />
            {errors.password && (
              <p className="text-red-500">Password is required</p>
            )}
          </div>
        </div>
        <AuthProvidersIcon />

        {success && <SuccessBox text={success} />}
        {error && <ErrorBox text={error} />}
        <Button className="w-full" disabled={isLoading}>
          Register
          {isLoading && <AiOutlineLoading className="animate-spin ml-2" />}
        </Button>
      </form>
      <div className="my-3">
        Has an Account? <Link href={"/auth/login"}>Login</Link>
      </div>
    </div>
  );
};

export default Register;
