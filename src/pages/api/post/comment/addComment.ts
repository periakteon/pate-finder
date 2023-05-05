import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { z, ZodError } from "zod";
import authMiddleware from "../../../../middleware/authMiddleware";

const prisma = new PrismaClient();

const commentSchema = z.object({
  postId: z.number(),
  text: z.string(),
});

async function addCommentHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }
  try {
    const userId = req.userId;
    console.log("user Id:", userId);

    const { postId, text } = commentSchema.parse(req.body);
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

export default authMiddleware(addCommentHandler);
