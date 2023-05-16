import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Post } from "@prisma/client";
import { z, ZodError } from "zod";
import authMiddleware from "../../../middleware/authMiddleware";
import { postRequestSchema } from "@/utils/zodSchemas";

const prisma = new PrismaClient();

type ResponseType = // Discriminated Union

    | { success: true; message: string; post?: Post }
    | { success: false; errors: string[] };

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, errors: ["Method not allowed"] });
  }
  const parsed = await postRequestSchema.safeParseAsync(req.body);

  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.values(errorMap).flatMap(
      (errors) => errors ?? [],
    );

    return res.status(400).json({ success: false, errors: errorMessages });
  }

  if (req.method === "POST") {
    try {
      const authorId = req.userId;
      const { caption, postImage } = parsed.data;

      const post = await prisma.post.create({
        data: {
          caption,
          postImage,
          author: { connect: { id: authorId } },
        },
      });

      res
        .status(200)
        .json({ success: true, message: "Post oluşturuldu:", post: post });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, errors: ["Internal Server Error"] });
    }
  }
}

export default authMiddleware(handlePost);
