"use client";
import { LoginSchema } from "@/Type/types";
import AuthFormHeader from "../Reuseables/AuthFormHeader";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "../ui/button";
import AuthProvidersIcon from "./AuthProvidersIcon";
import { useState } from "react";
import { loginAction } from "@/Actions/actions";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<LoginSchema>();
  const onSubmit: SubmitHandler<LoginSchema> = async (data: LoginSchema) => {
    try {
      setIsLoading(true);
      const res = await loginAction(data);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  return (
    <div>
      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className="w-[450px] border-gray-400 border-2 rounded-md p-4 shadow-xl"
      >
        <AuthFormHeader />
        <div className="flex flex-col gap-4">
          <div>
            <input
              type="email"
              {...register("email", { required: true, minLength: 1 })}
              placeholder="Email"
              className="w-full border-2 border-gray-400 rounded-md p-2 my-2"
            />
            {errors.email && <p className="text-red-500">Email is required</p>}
          </div>
          <div>
            <input
              type="text"
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
        {/* Todo : add ui for server actions response */}
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
