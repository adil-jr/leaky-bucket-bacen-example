import Router from "koa-router";
import { authMiddleware } from "./middlewares/authMiddleware";

const router = new Router();

router.get("/", (ctx) => {
  ctx.body = {
    status: "online",
    message: "Leaky Bucket API is running!",
    timestamp: new Date().toISOString(),
  };
});

router.get("/me", authMiddleware, (ctx) => {
  const user = ctx.state.user;

  ctx.body = {
    message: `Hello, ${user!.name}!`,
    authenticatedUser: user,
  };
});

export default router;
