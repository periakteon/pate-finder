import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handleUnfollowRequest(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { followerId, followingId } = req.body;

  if (!followerId || !followingId) {
    return res.status(400).json({ message: "Hatalı veya eksik ID" });
  }

  try {
    await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: parseInt(followerId),
          followingId: parseInt(followingId),
        },
      },
    });
    res.status(200).json({ message: "Başarıyla takipten çıkıldı!" });
  } catch (error) {
    res.status(405).json({ message: "Hata!", error: error });
  }
}
