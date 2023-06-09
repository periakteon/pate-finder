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
  const { email } = parsed.data;

  try {
    const following = await prisma.user.findUnique({ where: { email } });

    if (!following) {
      return res
        .status(404)
        .json({ success: false, errors: ["Kullanıcı bulunamadı"] });
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: Number(followerId),
          followingId: following.id,
        },
      },
    });
    return res
      .status(200)
      .json({ success: true, message: "Takipten çıkıldı." });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, errors: ["Internal Server Error"] });
  }
};

export default authMiddleware(handleUnfollowRequest);
