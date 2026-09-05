import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Middleware that proxies `/api/` requests to the server-only h3 router.
// We dynamically import the server-only fetch handler so `h3` is not pulled
// into client bundles by Vite.
const apiProxy = createMiddleware().server(async ({ request, next }) => {
  if (request.url.includes("/api/")) {
    // dynamically import server-only handler
    const { fetchHandler } = await import("./server-entry.server");
    try {
      return await fetchHandler(request as unknown as Request);
    } catch (error) {
      console.error("API route error:", error);
      if (error != null && typeof error === "object" && "statusCode" in error) {
        throw error;
      }
      return new Response(JSON.stringify({ error: "API error", details: String(error) }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
  }
  return await next();
});

export const startInstance = createStart(() => ({
  requestMiddleware: [apiProxy, errorMiddleware],
}));
