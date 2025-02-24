"use client";

import { verifyTokenAction } from "@/Actions/actions";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import ErrorBox from "../Reuseables/ErrorBox";
import SuccessBox from "../Reuseables/SuccessBox";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

const TokenVerification = () => {
  const searchTerm = useSearchParams();
  const token = searchTerm.get("token");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  if (!token) {
    redirect("/auth/login");
  }
  useEffect(() => {
    if (token) {
      const checkToken = async (token: string) => {
        setIsLoading(true);
        const res = await verifyTokenAction(token);
        if (res.success) {
          setIsLoading(false);
          setSuccess(res.msg);
        } else {
          setIsLoading(false);
          setError(res.msg);
        }
      };

      checkToken(token);
    }
  }, [token]);
  return (
    <div className="flex justify-center flex-col items-center h-screen">
      {isLoading && <AiOutlineLoading className="animate-spin" size={30} />}
      {!isLoading && (
        <div>
          {error && <ErrorBox text={error} />}
          {success && <SuccessBox text={success} />}
        </div>
      )}
      <div className="my-2">
        <Link
          href={"/auth/login"}
          className={buttonVariants({ variant: "default" })}
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default TokenVerification;
