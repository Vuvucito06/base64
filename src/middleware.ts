import { internalApiKey } from "./config";

export async function middleware() {
  await fetch("http://localhost:3000/api/internal/registerPageView", {
    method: "POST",
    headers: {
      "x-api-key": internalApiKey,
    },
  });
}

export const config = {
  matcher:
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
};
