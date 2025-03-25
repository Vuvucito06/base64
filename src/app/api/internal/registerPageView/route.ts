import { headers } from "next/headers";

import { registerPageView } from "@/lib/analytics";
import { internalApiKey } from "@/config";

export async function POST() {
  const headersList = await headers();
  const apiKey = headersList.get("x-api-key");

  if (apiKey !== internalApiKey) {
    return new Response("Unauthorized", { status: 401 });
  }

  await registerPageView();

  return new Response("OK");
}
