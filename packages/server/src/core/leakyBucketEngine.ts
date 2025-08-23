import { LeakyUser } from "./userModel";
import {
  MAX_TOKENS,
  ONE_HOUR_IN_MS,
  REPLENISH_RATE_PER_HOUR,
} from "./leakyBucketConstants";

export const replenishTokens = (user: LeakyUser, now: Date): LeakyUser => {
  if (user.tokens >= MAX_TOKENS) {
    return { ...user };
  }

  const diffInMs = now.getTime() - user.lastReplenished.getTime();

  const hoursPassed = Math.floor(diffInMs / ONE_HOUR_IN_MS);

  if (hoursPassed <= 0) {
    return { ...user };
  }

  const tokensToAdd = hoursPassed * REPLENISH_RATE_PER_HOUR;

  const newTokens = Math.min(user.tokens + tokensToAdd, MAX_TOKENS);

  const newLastReplenished = new Date(
    user.lastReplenished.getTime() + hoursPassed * ONE_HOUR_IN_MS,
  );

  return {
    ...user,
    tokens: newTokens,
    lastReplenished: newLastReplenished,
  };
};
