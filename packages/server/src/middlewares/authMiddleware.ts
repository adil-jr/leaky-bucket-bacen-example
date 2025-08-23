import { Context, Next } from "koa";
import { findUserByToken } from "../core/userService";

export const authMiddleware = async (ctx: Context, next: Next) => {
  const authHeader = ctx.request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.throw(401, "Authentication Error: Token must be provided as Bearer.");
  }

  const token = authHeader.substring(7);
  const currentUser = findUserByToken(token);

  if (!currentUser) {
    ctx.throw(401, "Authentication Error: Invalid token.");
  }

  ctx.state.user = currentUser;

  await next();
};
