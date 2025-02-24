import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { db } from "./db/db";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const token = await db.verificationToken.findUnique({
      where: {
        email,
      },
    });
    if (!token) {
      return null;
    }
    return token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getVerfictionTokenByToken = async (token: string) => {
  try {
    const theToken = await db.verificationToken.findFirst({
      where: {
        token,
      },
    });

    return theToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const generateVerificationToken = async (email: string) => {
  try {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600000);
    const existingToken = await getVerificationTokenByEmail(email);
    if (existingToken) {
      await db.verificationToken.delete({
        where: {
          id: existingToken.id,
        },
      });
    }
    const verificationToken = await db.verificationToken.create({
      data: {
        email,
        token,
        expires,
      },
    });
    return verificationToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};
