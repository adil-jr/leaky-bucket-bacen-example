import { Context, Next } from "koa";
import { replenishTokens } from "../core/leakyBucketEngine";
import { updateUserState } from "../core/userService";
import { getCurrentTime } from "../utils/timeUtils";

export const leakyBucketMiddleware = async (ctx: Context, next: Next) => {
  let user = ctx.state.user;
  if (!user) {
    ctx.throw(
      500,
      "User not found in context. Ensure authMiddleware runs first.",
    );
  }

  const now = getCurrentTime();

  const replenishedUser = replenishTokens(user, now);

  const updatedUser = {
    ...user,
    tokens: replenishedUser.tokens,
    lastReplenished: replenishedUser.lastReplenished,
  };

  updateUserState(updatedUser);

  if (updatedUser.tokens < 1) {
    ctx.status = 429;
    ctx.body = {
      error: "Rate limit exceeded",
      message: "You have no tokens left. Please try again later.",
      tokens_left: 0,
    };
    return;
  }

  const userAfterConsumption = {
    ...updatedUser,
    tokens: updatedUser.tokens - 1,
  };

  if (userAfterConsumption.tokens === 0) {
    userAfterConsumption.lastReplenished = now;
  }

  updateUserState(userAfterConsumption);

  ctx.state.user = userAfterConsumption;

  await next();
};
