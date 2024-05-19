import getSession from "./session";

export const Login = async (id: number) => {
  const session = await getSession();
  session.id = id;
  await session.save();
};
