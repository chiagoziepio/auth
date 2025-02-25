"use client";
import { loginWithGitHubbAction } from "@/Actions/actions";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { FaGithub } from "react-icons/fa";
const AuthProvidersIcon = () => {
  const [isLoading, setIsLoading] = useState(false);
  const loginWithBGithub = async () => {
    try {
      setIsLoading(true);
      await loginWithGitHubbAction();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center gap-2 my-3">
      <div
        onClick={loginWithBGithub}
        className="flex items-center gap-2 border border-black dark:bg-white dark:text-black rounded-md p-1 cursor-pointer"
      >
        <FaGithub size={24} />
        <span>Github</span>
        {isLoading && <AiOutlineLoading className="animate-spin ml-2" />}
      </div>
    </div>
  );
};

export default AuthProvidersIcon;
