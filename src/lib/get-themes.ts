import { cookies } from "next/headers";

export async function getTheme() {
  const cookieStore = cookies();
  return (await cookieStore).get("theme")?.value || "system";
}
