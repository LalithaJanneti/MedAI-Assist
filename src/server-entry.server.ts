import "@tanstack/react-start/server-only";
import { toWebHandler } from "h3";
import { router } from "./server/routes";

// Convert h3 router to web fetch handler and export for server-side dynamic import
export const fetchHandler = toWebHandler(router);



