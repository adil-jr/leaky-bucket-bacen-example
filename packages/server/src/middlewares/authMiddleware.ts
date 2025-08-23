import { Context, Next } from "koa";
import { validTokens, findUserById } from "../core/db";

export const authMiddleware = async (ctx: Context, next: Next) => {
  const authHeader = ctx.request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.throw(401, "Authentication Error: Token must be provided as Bearer.");
  }

  const token = authHeader.substring(7);

  if (!validTokens.has(token)) {
    ctx.throw(401, "Authentication Error: Invalid token.");
  }

  const userId = validTokens.get(token)!;
  const currentUser = findUserById(userId);

  if (!currentUser) {
    ctx.throw(401, "Authentication Error: User for token not found.");
  }

  ctx.state.user = currentUser;

  await next();
};
