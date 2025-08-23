import { User } from "../core/db";

declare module "koa" {
  interface DefaultState {
    user?: User;
  }
}
