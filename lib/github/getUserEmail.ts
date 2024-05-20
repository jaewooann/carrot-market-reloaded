export async function getUserEmail(access_token: string) {
  interface IEmailResponse {
    email: string;
    primary: boolean;
    verified: boolean;
    visibility: string;
  }
  const userEmailResponse: IEmailResponse[] = await (
    await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-cache",
    })
  ).json();
  const email = userEmailResponse.filter(
    (email) => email.verified && email.primary
  )[0]?.email;
  return email;
}
