"use server";

import { db } from "@/lib/db/db";
import { registerSchemaZod } from "@/Type/Schema/schema";
import { LoginSchema, RegisterSchema } from "@/Type/types";
import bcrypt from "bcrypt-edge";

export const loginAction = async (data: LoginSchema) => {};

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
    await db.user.create({
      data: {
        email,
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
