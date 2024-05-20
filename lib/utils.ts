import getSession from "./session";

export const saveSession = async (id: number) => {
  const session = await getSession();
  session.id = id;
  await session.save();
};
