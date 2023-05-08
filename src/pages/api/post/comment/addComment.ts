import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Comment } from "@prisma/client";
import { z } from "zod";
import authMiddleware from "../../../../middleware/authMiddleware";
import { commentRequestSchema } from "@/utils/zodSchemas";

const prisma = new PrismaClient();

type ResponseType =
  | { success: true; message: string; comment?: Comment }
  | { success: false; error: string[] };

async function addCommentHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  if (req.method !== "POST") {
    return res
      .status(400)
      .json({ success: false, error: ["Method not allowed"] });
  }

  const parsed = await commentRequestSchema.safeParseAsync(req.body);

  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    // console.log(errorMap);
    const errorMessages = Object.values(errorMap).flatMap(
      (errors) => errors ?? [],
    ); // error'un undefined dönme ihtimaline karşı array dönmesi için coalesce operatörü

    return res.status(400).json({ success: false, error: errorMessages });
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
    });

    res.status(200).json({ success: true, message: "Comment added", comment });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: ["Comment error"] });
  }
}

export default authMiddleware(addCommentHandler);
