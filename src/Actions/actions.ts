"use server";

import { db } from "@/lib/db/db";
import { loginSchemaZod, registerSchemaZod } from "@/Type/Schema/schema";
import { LoginSchema, RegisterSchema } from "@/Type/types";
import bcrypt from "bcrypt-edge";
import { AuthError } from "next-auth";
import { signIn, signOut } from "../../auth";
import {
  generateVerificationToken,
  getVerfictionTokenByToken,
} from "@/lib/utils";
import { sendMail } from "@/lib/sendMail";

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
        msg: "Enter valid credentials",
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

    if (!user.emailVerified) {
      const verificationToken = await generateVerificationToken(email);
      if (!verificationToken) {
        return {
          success: false,
          msg: "failed to generate verification token",
        };
      }
      const emailVerify = await sendMail(email, verificationToken.token);
      if (!emailVerify.success) {
        return {
          success: false,
          msg: "failed to send verification email",
        };
      }
      return {
        success: false,
        msg: "Please verify your email,  check your email",
      };
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Disable automatic redirect
    });

    if (result?.error) {
      return { success: false, msg: "something went wrong" };
    }
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

    const verificationToken = await generateVerificationToken(lowerCaseEmail);
    if (!verificationToken) {
      return {
        success: false,
        msg: "failed to generate verification token",
      };
    }
    const verEmail = await sendMail(lowerCaseEmail, verificationToken.token);

    if (!verEmail.success) {
      return {
        success: false,
        msg: "failed to send verification email",
      };
    }

    return {
      success: true,
      msg: "registration success, check your email for verification",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      msg: "registration failed",
    };
  }
};

export const LogoutAction = async () => {
  await signOut();
};

export const loginWithGitHubbAction = async () => {
  await signIn("github", { redirectTo: "/dashboard" });
};

export const verifyTokenAction = async (token: string) => {
  try {
    const verificationToken = await getVerfictionTokenByToken(token);
    if (!verificationToken) {
      return {
        success: false,
        msg: "invalid token",
      };
    }
    if (verificationToken.expires < new Date()) {
      return {
        success: false,
        msg: "token expired",
      };
    }
    await db.user.update({
      where: {
        email: verificationToken.email,
      },
      data: {
        emailVerified: new Date(),
      },
    });
    return {
      success: true,
      msg: "token verified",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      msg: "failed to verify token",
    };
  }
};
