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

  //attigim request'te userId yok
  const userId = req.userId;
  console.log("userId", userId);
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, errors: ["User not found"] });
    }
    const profileResponse: ResponseType = {
      success: true,
      user: {
        id: user.id,
        username: user.username,
      },
    };
    return res.status(200).json(profileResponse);
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    return res
      .status(500)
      .json({ success: false, errors: ["Internal server error"] });
  }
}

export default authMiddleware(myProfile);
