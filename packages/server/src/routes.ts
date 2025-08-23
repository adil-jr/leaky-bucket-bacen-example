import Router from "koa-router";
import { authMiddleware } from "./middlewares/authMiddleware";
import { leakyBucketMiddleware } from "./middlewares/leakyBucketMiddleware";
import { updateUserState } from "./core/userService";

const router = new Router();

router.get("/", (ctx) => {
  /* ... */
});
router.get("/me", authMiddleware, (ctx) => {
  /* ... */
});

router.post("/pix/keys/:key", authMiddleware, leakyBucketMiddleware, (ctx) => {
  const user = ctx.state.user!;
  const { key } = ctx.params;

  if (user.tokens < 1) {
    ctx.status = 429;
    ctx.body = {
      error: "Rate limit exceeded",
      message: "You have no tokens left. Please try again later.",
      tokens_left: 0,
    };
    return;
  }

  const userAfterConsumption = {
    ...user,
    tokens: user.tokens - 1,
  };

  updateUserState(userAfterConsumption);

  ctx.status = 200;
  ctx.body = {
    message: `Successfully looked up PIX key '${key}'`,
    tokens_left: userAfterConsumption.tokens,
  };
});

export default router;
