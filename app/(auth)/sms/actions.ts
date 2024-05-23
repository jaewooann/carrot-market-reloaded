"use server";

import twilio from "twilio";
import crypto from "crypto";
import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { saveSession } from "@/lib/saveSession";

let PHONE_NUMBER = "";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "wrong phone format"
  );

async function phoneNumberValid(token: number) {
  const _token = await db.sMSToken.findUnique({
    where: {
      token: token + "",
    },
    select: {
      phone: true,
    },
  });
  return _token?.phone === PHONE_NUMBER;
}

async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });
  return Boolean(exists);
}

const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(tokenExists, "This token does not exist.")
  .refine(phoneNumberValid, "the phone number and token does not match");

interface ActionState {
  token: boolean;
  phone: string;
}

async function getToken() {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });
  if (exists) {
    return getToken();
  } else {
    return token;
  }
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      console.log(result.error.flatten());
      return {
        token: false,
        phone: "",
        error: result.error.flatten(),
      };
    } else {
      // 이전 토큰 삭제하기
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });

      PHONE_NUMBER = result.data;

      // 새로운 토큰 생성하기
      const token = await getToken();
      await db.sMSToken.create({
        data: {
          token,
          phone: result.data,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });

      // 유저에게 토큰 보내기 (트윌리오통해서)
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      await client.messages.create({
        body: `Your Karrot verification code is: ${token}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: process.env.MY_PHONE_NUMBER!,
      });

      return {
        token: true,
        phone: PHONE_NUMBER,
      };
    }
  } else {
    const result = await tokenSchema.safeParseAsync(token);
    if (!result.success) {
      return {
        token: true,
        phone: prevState.phone,
        error: result.error.flatten(),
      };
    } else {
      // 토큰에 연결된 유저 아이디를 찾아야함
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      });

      // 유저아이디를 통해 로그인하기
      await saveSession(token!.userId);
      await db.sMSToken.delete({
        where: {
          id: token!.id,
        },
      });
      redirect("/profile");
    }
  }
}
