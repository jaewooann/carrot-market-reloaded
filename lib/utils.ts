import getSession from "./session";

export const saveSession = async (id: number) => {
  const session = await getSession();
  session.id = id;
  await session.save();
};

export const formatToWon = (price: number): string => {
  return price.toLocaleString("ko-KR");
};

export const formatToTimeAgo = (date: string): string => {
  const dayInMs = 1000 * 60 * 60 * 24;
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = Math.round((time - now) / dayInMs);

  const formatter = new Intl.RelativeTimeFormat("ko");
  return formatter.format(diff, "days");
};
