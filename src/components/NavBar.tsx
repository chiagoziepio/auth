"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Logout from "./Authentication/Logout";

import { ModeToggle } from "./ThemeToggler";
const NavBar = () => {
  const session = useSession();

  return (
    <header className="flex justify-between items-center px-3 py-2">
      <div>
        <Link href="/">
          <span className="font-extrabold text-black text-3xl dark:text-blue-400">
            🔏 Auth
          </span>
        </Link>
      </div>
      <ul className="flex gap-3">
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
        <ModeToggle />
      </ul>
    </header>
  );
};

export default NavBar;
