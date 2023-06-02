import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma, PrismaClient } from "@prisma/client";
import authMiddleware from "@/middleware/authMiddleware";
import { z } from "zod";
import { followGetResponse, followRequestSchema } from "@/utils/zodSchemas";

const prisma = new PrismaClient();

type ResponseType = z.infer<typeof followGetResponse>;

const handleCheckFollowRequest = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: ["Method not allowed"] });
  }

  const parsed = await followRequestSchema.safeParseAsync(req.body);

  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.values(errorMap).flatMap(
      (errors) => errors ?? []
    );

    return res.status(400).json({ success: false, message: errorMessages });
  }

  const followerId = req.userId;
  const { email } = parsed.data;

  try {
    const followingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!followingUser) {
      return res
        .status(404)
        .json({ success: false, message: ["Following user not found"] });
    }

    const follow = await prisma.follow.findFirst({
      where: {
        followerId: Number(followerId),
        followingId: followingUser.id,
      },
    });

    if (follow) {
      return res.status(200).json({ success: true, message: "Takip ediliyor" });
    }

    return res.status(200).json({ success: false, message: ["Takip edilmiyor"] });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res
          .status(200)
          .json({ success: true, message: "Zaten takip ediyorsunuz!" });
      }

      res.status(500).json({ success: false, message: [JSON.stringify(error)] });
    }
  }
};

export default authMiddleware(handleCheckFollowRequest);
