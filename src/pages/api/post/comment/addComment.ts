import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../../../../middleware/authMiddleware";
import { z } from "zod";
import {
  commentRequestSchema,
  commentResponseSchema,
} from "@/utils/zodSchemas";

const prisma = new PrismaClient();

type CommentResponse = z.infer<typeof commentResponseSchema>;

type ResponseType =
  | { success: true; message: string; comment?: CommentResponse }
  | { success: false; errors: string[] };

async function addCommentHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  if (req.method !== "POST") {
    return res
      .status(400)
      .json({ success: false, errors: ["Method not allowed"] });
  }

  const parsed = await commentRequestSchema.safeParseAsync(req.body);

  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.values(errorMap).flatMap(
      (errors) => errors ?? [],
    );

    return res.status(400).json({ success: false, errors: errorMessages });
  }

  const userId = req.userId;
  const { text, postId } = parsed.data;

  try {
    const comment = await prisma.comment.create({
      data: {
        text,
        user: {
          connect: {
            id: userId,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
      },
      include: {
        user: {
          select: {
            profile_picture: true,
            username: true,
          },
        },
      },
    });

    res.status(200).json({ success: true, message: "Comment added", comment });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, errors: ["Comment error"] });
  }
}

export default authMiddleware(addCommentHandler);
