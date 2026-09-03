import { getAuth } from "@/app/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

let _handler: ReturnType<typeof toNextJsHandler>;
function getHandler() {
  if (!_handler) _handler = toNextJsHandler(getAuth());
  return _handler;
}

export const GET = (req: Request) => getHandler().GET(req);
export const POST = (req: Request) => getHandler().POST(req);