import { publicProcedure } from "~/procedures";
import { createTRPCRouter } from "~/trpc";
import {
  loginMutationHandler,
  registerMutationHandler,
} from "./user.controller";
import { createUserSchema, loginUserSchema } from "./user.schema";

export const userRouter = createTRPCRouter({
  login: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        summary: "Login",
        path: "/user/login",
        tags: ["user"],
        example: {
          request: {
            email: "emil.malanczak@gmail.com",
            password: "password123",
          },
        },
      },
    })
    .input(loginUserSchema.input)
    .output(loginUserSchema.output)
    .mutation(({ input }) => loginMutationHandler(input)),
  register: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        summary: "Register a new user",
        path: "/auth/register",
        tags: ["auth"],
        example: {
          request: {
            email: "emil.malanczak@gmail.com",
            name: "test user",
            password: "password123",
            passwordConfirm: "password123",
          },
        },
      },
    })
    .input(createUserSchema.input)
    .output(createUserSchema.output)
    .mutation(({ input }) => registerMutationHandler(input)),
});
