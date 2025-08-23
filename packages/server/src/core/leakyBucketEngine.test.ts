import { replenishTokens } from "./leakyBucketEngine";
import { LeakyUser } from "./userModel";
import { MAX_TOKENS, ONE_HOUR_IN_MS } from "./leakyBucketConstants";

const createMockUser = (tokens: number, lastReplenished: Date): LeakyUser => ({
  id: "test-user",
  name: "Test User",
  token: "test-token",
  tokens,
  lastReplenished,
});

describe("Leaky Bucket Engine - replenishTokens", () => {
  const now = new Date("2025-08-23T20:00:00.000Z");

  it("should NOT replenish tokens if user already has the maximum amount", () => {
    const user = createMockUser(
      MAX_TOKENS,
      new Date(now.getTime() - 5 * ONE_HOUR_IN_MS),
    );

    const updatedUser = replenishTokens(user, now);

    expect(updatedUser.tokens).toBe(MAX_TOKENS);
    expect(updatedUser.lastReplenished).toEqual(user.lastReplenished);
  });

  it("should NOT replenish tokens if less than a full hour has passed", () => {
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
    const user = createMockUser(5, thirtyMinutesAgo);

    const updatedUser = replenishTokens(user, now);

    expect(updatedUser.tokens).toBe(5);
  });

  it("should add 1 token if exactly one hour has passed", () => {
    const oneHourAgo = new Date(now.getTime() - ONE_HOUR_IN_MS);
    const user = createMockUser(8, oneHourAgo);

    const updatedUser = replenishTokens(user, now);

    expect(updatedUser.tokens).toBe(9);
    expect(updatedUser.lastReplenished).toEqual(now);
  });

  it("should add multiple tokens for multiple full hours passed", () => {
    const threeAndHalfHoursAgo = new Date(now.getTime() - 3.5 * ONE_HOUR_IN_MS);
    const user = createMockUser(2, threeAndHalfHoursAgo);

    const updatedUser = replenishTokens(user, now);

    expect(updatedUser.tokens).toBe(5);
  });

  it("should replenish tokens up to the maximum limit and NOT exceed it", () => {
    const fiveHoursAgo = new Date(now.getTime() - 5 * ONE_HOUR_IN_MS);
    const user = createMockUser(8, fiveHoursAgo);

    const updatedUser = replenishTokens(user, now);

    expect(updatedUser.tokens).toBe(MAX_TOKENS);
  });

  it("should correctly replenish from zero tokens", () => {
    const fourHoursAgo = new Date(now.getTime() - 4 * ONE_HOUR_IN_MS);
    const user = createMockUser(0, fourHoursAgo);

    const updatedUser = replenishTokens(user, now);

    expect(updatedUser.tokens).toBe(4);
  });
});
