import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "@/middleware/authMiddleware";

const prisma = new PrismaClient();

const handleFollowRequest = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { followingId } = req.body;

  // TODO: ALARM ALARM zod type validation for body

  const followerId = req.userId;

  try {
    const follow = await prisma.follows.create({
      data: {
        follower: {
          connect: {
            id: Number(followerId),
          },
        },
        following: {
          connect: {
            id: Number(followingId),
          },
        },
      },
    });

    console.log("Takip işlemi başarılı!");

    res.status(200).json({ message: "Takip başarılı!", follow });
  } catch (error) {
    // TODO: handle already existing prisma error.
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default authMiddleware(handleFollowRequest);
