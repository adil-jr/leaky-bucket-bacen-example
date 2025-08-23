import Router from "koa-router";

const router = new Router();

router.get("/", (ctx) => {
  ctx.body = {
    status: "online",
    message: "Leaky Bucket API is running!",
    timestamp: new Date().toISOString(),
  };
});

export default router;
