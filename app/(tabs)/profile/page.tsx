import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import React, { Suspense } from "react";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
}

async function Username() {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  const user = await getUser();
  return <h1>Welcome! {user?.username}!</h1>;
}

const Profile = async () => {
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div>
      <Suspense fallback={"welcome"}>
        <Username />
      </Suspense>
      <form action={logOut}>
        <button>Log out</button>
      </form>
    </div>
  );
};

export default Profile;
