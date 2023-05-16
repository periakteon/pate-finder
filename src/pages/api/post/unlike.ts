import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "@/middleware/authMiddleware";
import { z } from "zod";
import { unlikeResponse, unlikeRequest } from "@/utils/zodSchemas";

const prisma = new PrismaClient();

type ResponseType = z.infer<typeof unlikeResponse>;

const handleUnlikeRequest = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, errors: ["Method not allowed"] });
  }

  const userId = req.userId;
  const parsed = await unlikeRequest.safeParseAsync(req.body);

  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.values(errorMap).flatMap(
      (errors) => errors ?? [],
    );

    return res.status(400).json({ success: false, errors: errorMessages });
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
      // Unlike the post by deleting the existing like
      await prisma.like.delete({
        where: { id: existingLike.id },
      });

      return res.status(200).json({
        success: true,
        message: "Like başarılı bir şekilde kaldırıldı!",
        like: existingLike,
      });
    } else {
      return res.status(200).json({
        success: false,
        errors: ["Bu gönderiyi zaten beğenmediğiniz için beğeni kaldırılamaz!"],
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, errors: ["Internal Server Error"] });
  }
};

export default authMiddleware(handleUnlikeRequest);
