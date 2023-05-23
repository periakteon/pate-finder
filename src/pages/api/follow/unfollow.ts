import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "@/middleware/authMiddleware";
import { z } from "zod";
import { unfollowResponse, unfollowRequestSchema } from "@/utils/zodSchemas";

const prisma = new PrismaClient();

type ResponseType = z.infer<typeof unfollowResponse>;

const handleUnfollowRequest = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, errors: ["Method not allowed"] });
  }

  const parsed = await unfollowRequestSchema.safeParseAsync(req.body);

  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.values(errorMap).flatMap(
      (errors) => errors ?? [],
    );
    return res.status(400).json({ success: false, errors: errorMessages });
  }

  const followerId = req.userId;
  const { followingId } = parsed.data;

  try {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: Number(followerId),
          followingId: Number(followingId),
        },
      },
    });
    res.status(200).json({ success: true, message: "Takipten çıkıldı." });
  } catch (errors) {
    res.status(405).json({ success: false, errors: ["Method not allowed"] });
  }
};

export default authMiddleware(handleUnfollowRequest);
