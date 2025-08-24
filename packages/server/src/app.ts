import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import { ApolloServer } from "@apollo/server";
import { koaMiddleware } from "@as-integrations/koa";

import restRouter from "./routes";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { authMiddleware } from "./middlewares/authMiddleware";
import { leakyBucketMiddleware } from "./middlewares/leakyBucketMiddleware";

export const createApp = async () => {
  const app = new Koa();
  const router = new Router();

  const apolloServer = new ApolloServer({ typeDefs, resolvers });
  await apolloServer.start();

  app.use(
    cors({
      origin: "http://localhost:3000/graphql",

      allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

      allowHeaders: ["Content-Type", "Authorization"],

      credentials: true,
    }),
  );

  app.use(bodyParser());
  router.use(restRouter.routes());

  router.all(
    "/graphql",
    async (ctx, next) => {
      if (ctx.method === "POST") {
        await authMiddleware(ctx, async () => {
          return await leakyBucketMiddleware(ctx, next);
        });
      } else {
        await next();
      }
    },
    koaMiddleware(apolloServer, {
      context: async ({ ctx }) => ({ ctx }),
    }),
  );

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
};
