"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Logout from "./Authentication/Logout";
const NavBar = () => {
  const session = useSession();
  //console.log(session);

  return (
    <header className="flex justify-between items-center px-3 py-2">
      <div>
        <Link href="/">
          <span className="font-extrabold text-black text-3xl">🔏 Auth</span>
        </Link>
      </div>
      <ul>
        {!session?.data?.user ? (
          <Link
            href={"/auth/login"}
            className={buttonVariants({ variant: "default" })}
          >
            Login
          </Link>
        ) : (
          <Logout />
        )}
      </ul>
    </header>
  );
};

export default NavBar;
