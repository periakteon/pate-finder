import { z } from "zod";

export const followFollowResponse = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    message: z.string(),
  }),
  z.object({
    success: z.literal(false),
    error: z.array(z.string()),
  }),
]);

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const loginResponseSchema = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    message: z.string(),
  }),
  z.object({
    success: z.literal(false),
    errors: z.array(z.string()),
  }),
]);
