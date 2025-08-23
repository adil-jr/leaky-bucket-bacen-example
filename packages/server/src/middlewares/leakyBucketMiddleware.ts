import { Context, Next } from "koa";
import { replenishTokens } from "../core/leakyBucketEngine";
import { updateUserState } from "../core/userService";

export const leakyBucketMiddleware = async (ctx: Context, next: Next) => {
  const currentUser = ctx.state.user;
  if (!currentUser) {
    ctx.throw(500, "User not found in context.");
  }

  const userAfterReplenish = replenishTokens(currentUser, new Date());

  if (currentUser.tokens !== userAfterReplenish.tokens) {
    updateUserState(userAfterReplenish);
  }

  ctx.state.user = userAfterReplenish;

  await next();
};
