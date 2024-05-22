import db from "@/lib/db";
import getAccessToken from "@/lib/github/getAccessToken";
import { getUserEmail } from "@/lib/github/getUserEmail";
import { getUserProfile } from "@/lib/github/getUserProfile";
import { saveSession } from "@/lib/utils";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }
  const { error, access_token } = await getAccessToken(code);
  if (error) {
    return new Response(null, {
      status: 400,
    });
  }

  const { id, avatar_url, login } = await getUserProfile(access_token);

  const email = await getUserEmail(access_token);
  const user = await db.user.findFirst({
    where: {
      OR: [{ email: email ?? "" }, { github_id: id + "" }],
    },
    select: {
      id: true,
    },
  });
  if (user) {
    await saveSession(user.id);
  } else {
    const dbUser = await db.user.findUnique({
      where: {
        username: login,
      },
      select: {
        id: true,
      },
    });
    let username = login;
    if (dbUser) {
      username = login + "-gt";
    }
    const newUser = await db.user.create({
      data: {
        username,
        email,
        github_id: id + "",
        avatar: avatar_url,
      },
      select: {
        id: true,
      },
    });
    await saveSession(newUser.id);
  }
  return redirect("/profile");
}
