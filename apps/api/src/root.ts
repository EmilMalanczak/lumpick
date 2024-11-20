import { userRouter } from "~modules/user/user.router";

import { authRouter } from "./modules/auth/auth.router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
