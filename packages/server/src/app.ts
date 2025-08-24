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
      origin: (ctx) => {
        const allowedOrigin = "http://localhost:5173";

        if (ctx.request.header.origin === allowedOrigin) {
          return allowedOrigin;
        }

        return "";
      },
      allowMethods: ["GET", "POST", "OPTIONS"],
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
