"use server";

import { db } from "@/lib/db/db";
import { loginSchemaZod, registerSchemaZod } from "@/Type/Schema/schema";
import { LoginSchema, RegisterSchema } from "@/Type/types";
import bcrypt from "bcrypt-edge";
import { AuthError } from "next-auth";
import { signIn } from "../../auth";

export const loginAction = async (data: LoginSchema) => {
  try {
    const { email, password } = data;
    const validateData = loginSchemaZod.safeParse({
      email,
      password,
    });
    if (!validateData.success) {
      return {
        success: false,
        msg: validateData.error.errors,
      };
    }
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user || !user.password) {
      return {
        success: false,
        msg: "User not found",
      };
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        msg: "Invalid credentials",
      };
    }
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
    });
    return {
      success: true,
      msg: "Login successful",
    };
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, msg: "Invalid credentials" };
        default:
          return { success: false, msg: "please check your email or password" };
      }
    }
  }
  throw Error;
};

export const registerAction = async (data: RegisterSchema) => {
  try {
    const { name, email, password } = data;
    const validateData = registerSchemaZod.safeParse({
      name,
      email,
      password,
    });

    if (!validateData.success) {
      return {
        sucess: false,
        msg: validateData.error.errors,
      };
    }
    const isEmailExisting = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (isEmailExisting) {
      return {
        success: false,
        msg: "Email already exists",
      };
    }

    const hashPwd = bcrypt.hashSync(password, 10);
    const lowerCaseEmail = email.toLowerCase();
    await db.user.create({
      data: {
        email: lowerCaseEmail,
        name,
        password: hashPwd,
      },
    });

    return {
      success: true,
      msg: "registration success",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      msg: "registration failed",
    };
  }
};
