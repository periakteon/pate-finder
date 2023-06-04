import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { deleteRequestSchema, deleteResponseSchema } from "@/utils/zodSchemas";
import { z } from "zod";
import authMiddleware from "../../../middleware/authMiddleware";

const prisma = new PrismaClient();

type ResponseType = z.infer<typeof deleteResponseSchema>;

const deletePostHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, errors: ["Method Not Allowed"] });
  }

  const userId = req.userId;
  const parsed = await deleteRequestSchema.safeParseAsync(req.body);

  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.values(errorMap).flatMap(
      (errors) => errors ?? [],
    );

    return res.status(400).json({ success: false, errors: errorMessages });
  }

  const { postId } = parsed.data;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
      select: {
        authorId: true,
      },
    });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, errors: ["Gönderi bulunamadı"] });
    }

    if (post.authorId !== userId) {
      return res
        .status(403)
        .json({ success: false, errors: ["Bunu yapmaya yetkiniz yoktur."] });
    }

    await prisma.comment.deleteMany({
      where: {
        postId: Number(postId),
      },
    });

    await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });

    res.status(200).json({ success: true, message: "Post başarıyla silindi!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errors: ["Internal Server Error"] });
  }
};

export default authMiddleware(deletePostHandler);
