import request from "supertest";
import app from "../app";
import { resetUserStateForTesting } from "./userService";
import * as timeUtils from "../utils/timeUtils";

const VALID_TOKEN = "alice-super-secret-token";

describe("Integration Test: POST /pix/keys/:key", () => {
  let mockCurrentTime: jest.SpyInstance;
  let baseTime: Date;

  beforeAll(() => {
    jest.useFakeTimers();
    baseTime = new Date("2025-08-23T23:30:00.000Z");
    mockCurrentTime = jest
      .spyOn(timeUtils, "getCurrentTime")
      .mockReturnValue(baseTime);
  });

  beforeEach(() => {
    resetUserStateForTesting();
    mockCurrentTime.mockReturnValue(baseTime);
  });

  afterAll(() => {
    jest.useRealTimers();
    mockCurrentTime.mockRestore();
  });

  it("should return 401 Unauthorized if no token is provided", async () => {
    const response = await request(app.callback()).post("/pix/keys/some-key");
    expect(response.status).toBe(401);
  });

  it("should return 401 Unauthorized if token is invalid", async () => {
    const response = await request(app.callback())
      .post("/pix/keys/some-key")
      .set("Authorization", "Bearer invalid-token");
    expect(response.status).toBe(401);
  });

  it("should return 200 OK and decrement tokens on a valid request", async () => {
    const response = await request(app.callback())
      .post("/pix/keys/some-valid-key")
      .set("Authorization", `Bearer ${VALID_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toContain("Successfully looked up PIX key");
    expect(response.body.tokens_left).toBe(9);
  });

  it("should return 429 Too Many Requests after exhausting all tokens", async () => {
    await Array.from({ length: 10 }).reduce(async (promise, _, i) => {
      await promise;
      const res = await request(app.callback())
        .post(`/pix/keys/key-${i}`)
        .set("Authorization", `Bearer ${VALID_TOKEN}`);
      expect(res.status).toBe(200);
    }, Promise.resolve());

    const eleventhResponse = await request(app.callback())
      .post("/pix/keys/key-11")
      .set("Authorization", `Bearer ${VALID_TOKEN}`);

    expect(eleventhResponse.status).toBe(429);
    expect(eleventhResponse.body.error).toBe("Rate limit exceeded");
    expect(eleventhResponse.body.tokens_left).toBe(0);
  });

  it("should replenish tokens after time has passed", async () => {
    await request(app.callback())
      .post("/pix/keys/a-key")
      .set("Authorization", `Bearer ${VALID_TOKEN}`);

    const futureTime = new Date(baseTime.getTime() + 3 * 60 * 60 * 1000);
    mockCurrentTime.mockReturnValue(futureTime);
    jest.advanceTimersByTime(3 * 60 * 60 * 1000);

    const response = await request(app.callback())
      .post("/pix/keys/another-key")
      .set("Authorization", `Bearer ${VALID_TOKEN}`);

    expect(response.body.tokens_left).toBe(9);
  });
});
