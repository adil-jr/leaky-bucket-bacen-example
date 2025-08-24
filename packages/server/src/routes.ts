import Router from "koa-router";
import { authMiddleware } from "./middlewares/authMiddleware";
import { leakyBucketMiddleware } from "./middlewares/leakyBucketMiddleware";
import { updateUserState } from "./core/userService";

const router = new Router();

router.get("/", (ctx) => {});
router.get("/me", authMiddleware, (ctx) => {});

router.post("/pix/keys/:key", authMiddleware, leakyBucketMiddleware, (ctx) => {
  const user = ctx.state.user!;
  const { key } = ctx.params;

  ctx.status = 200;
  ctx.body = {
    message: `Successfully looked up PIX key '${key}'`,
    tokens_left: user.tokens,
  };
});

export default router;
