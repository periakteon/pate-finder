import type { NextApiRequest } from "next";

declare module "next" {
  interface NextApiRequest extends NextApiRequest {
    userId: number;
  }
}
