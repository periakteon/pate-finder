import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "@/middleware/authMiddleware";

const prisma = new PrismaClient();

const handleUnfollowRequest = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const followerId = req.userId;
  const { followingId } = req.body;

  // TODO: ALARM ALARM no zod type validation

  try {
    await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: parseInt(followingId),
        },
      },
    });
    res.status(200).json({ message: "Başarıyla takipten çıkıldı!" });
  } catch (error) {
    // TODO: Check if it errors for already not present connection
    res.status(405).json({ message: "Hata!", error: error });
  }
};

export default authMiddleware(handleUnfollowRequest);
