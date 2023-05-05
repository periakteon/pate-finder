import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { z, ZodError } from "zod";

const prisma = new PrismaClient();

const commentSchema = z.object({
  postId: z.number(),
  userId: z.number(),
  text: z.string(),
});

export default async function addCommentHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }
  try {
    const { postId, userId, text } = commentSchema.parse(req.body);
    const comment = await prisma.comment.create({
      data: {
        text,
        owner: {
          connect: {
            id: userId,
          },
        },
        relatedPost: {
          connect: {
            id: postId,
          },
        },
      },
    });

    res.status(200).json({ comment });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid data provided" });
  }
}
