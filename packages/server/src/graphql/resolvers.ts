import { Context } from "koa";
import { LeakyUser } from "../core/userModel";

interface GraphQLContext {
  ctx: Context & { state: { user?: LeakyUser } };
}

export const resolvers = {
  Query: {
    me: (
      parent: unknown,
      args: {},
      context: GraphQLContext,
    ): LeakyUser | null => {
      return context.ctx.state.user || null;
    },
  },
  Mutation: {
    lookupPixKey: (
      parent: unknown,
      args: { key: string },
      context: GraphQLContext,
    ) => {
      const user = context.ctx.state.user;

      if (!user) {
        throw new Error("User not found. Authentication required.");
      }

      return {
        success: true,
        message: `Successfully looked up PIX key '${args.key}'`,
        user: user,
      };
    },
  },
  User: {
    lastReplenished: (user: LeakyUser): string => {
      return user.lastReplenished.toISOString();
    },
  },
};
