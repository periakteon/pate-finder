import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { myProfileResponseSchema } from "@/utils/zodSchemas";
import authMiddleware from "@/middleware/authMiddleware";

const prisma = new PrismaClient();

type ResponseType = z.infer<typeof myProfileResponseSchema>;

async function myProfile(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, errors: ["Method not allowed"] });
  }

  const userId = req.userId;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        posts: true,
        pet: true,
        profile_picture: true,
        followedBy: true,
        following: true,
        likes: true,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, errors: ["User not found"] });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    return res
      .status(500)
      .json({ success: false, errors: ["Internal server error"] });
  }
}

export default authMiddleware(myProfile);
