import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "@/middleware/authMiddleware";
import { z } from "zod";
import { likeResponse, likeRequest } from "@/utils/zodSchemas";

const prisma = new PrismaClient();

type ResponseType = z.infer<typeof likeResponse>;

const handleLikeRequest = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) => {
  const parsed = await likeRequest.safeParseAsync(req.body);
  const userId = req.userId;

  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.values(errorMap).flatMap(
      (errors) => errors ?? [],
    );

    return res.status(400).json({ success: false, errors: errorMessages });
  }

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, errors: ["Method not allowed"] });
  }

  const { postId } = parsed.data;

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (existingLike) {
      // Like already exists, update the existing like
      const updatedLike = await prisma.like.update({
        where: { id: existingLike.id },
        data: {},
      });

      res.status(200).json({
        success: true,
        message: "Like güncellendi!",
        like: updatedLike,
      });
    } else {
      // Like does not exist, create a new like
      const newLike = await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });

      res.status(200).json({
        success: true,
        message: "Like başarılı!",
        like: newLike,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, errors: ["Internal Server Error"] });
  }
};

export default authMiddleware(handleLikeRequest);
